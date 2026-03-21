const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || "";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

const PIXABAY_CATEGORY_MAP = {
  animals: "animals",
  food: "food",
  nature: "nature",
  things: "education",
};

const PIXABAY_CATEGORY_KEYWORDS = {
  animals: ["animal", "pet", "wildlife", "cute"],
  food: ["food", "fruit", "dessert", "meal", "drink"],
  nature: ["nature", "outdoors", "sky", "plant", "landscape"],
  things: ["object", "toy", "book", "school", "transport"],
};

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!isPixabayConfigured() && !isPexelsConfigured()) {
    return res.status(200).json({ configured: false, photo: null });
  }

  const query = typeof req.query?.query === "string" ? req.query.query.trim() : "";
  const category = typeof req.query?.category === "string" ? req.query.category.trim() : "";
  const excludeIds = typeof req.query?.exclude === "string"
    ? req.query.exclude.split(",").map((value) => value.trim()).filter(Boolean)
    : [];
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    let photo = null;
    if (isPixabayConfigured()) {
      photo = await searchPixabayPhoto(query, category, excludeIds);
    }
    if (!photo && isPexelsConfigured()) {
      photo = await searchPexelsPhoto(query, category, excludeIds);
    }
    return res.status(200).json({ configured: true, photo });
  } catch (error) {
    console.error("Photo search error:", error.message);
    return res.status(200).json({ configured: true, photo: null });
  }
};

async function searchPixabayPhoto(query, category, excludeIds = []) {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", PIXABAY_API_KEY);
  url.searchParams.set("q", query);
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("lang", "en");
  url.searchParams.set("per_page", "30");
  url.searchParams.set("order", "popular");

  const mappedCategory = PIXABAY_CATEGORY_MAP[category];
  if (mappedCategory) url.searchParams.set("category", mappedCategory);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pixabay search failed: ${response.status}`);
  }

  const data = await response.json();
  const photos = Array.isArray(data.hits) ? data.hits : [];
  const bestPhoto = chooseBestPixabayPhoto(photos, category, query, excludeIds);

  if (!bestPhoto) return null;

  return {
    id: bestPhoto.id,
    src: bestPhoto.webformatURL || bestPhoto.largeImageURL || bestPhoto.previewURL || "",
    gridSrc: bestPhoto.previewURL || bestPhoto.webformatURL || bestPhoto.largeImageURL || "",
    alt: bestPhoto.tags || query,
    photographer: bestPhoto.user || "Pixabay",
    photographerUrl: `https://pixabay.com/users/${bestPhoto.user || "pixabay"}-${bestPhoto.user_id || ""}/`,
    url: bestPhoto.pageURL || "https://pixabay.com",
    provider: "pixabay",
  };
}

async function searchPexelsPhoto(query, category, excludeIds = []) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orientation", "square");
  url.searchParams.set("size", "medium");
  url.searchParams.set("locale", "en-US");

  const response = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  if (!response.ok) {
    throw new Error(`Pexels search failed: ${response.status}`);
  }

  const data = await response.json();
  const photos = Array.isArray(data.photos) ? data.photos : [];
  const bestPhoto = chooseBestPexelsPhoto(photos, category, query, excludeIds);

  if (!bestPhoto) return null;

  return {
    id: bestPhoto.id,
    src: bestPhoto.src?.large || bestPhoto.src?.medium || bestPhoto.src?.original || "",
    gridSrc: bestPhoto.src?.medium || bestPhoto.src?.small || bestPhoto.src?.large || bestPhoto.src?.original || "",
    alt: bestPhoto.alt || query,
    photographer: bestPhoto.photographer || "Pexels",
    photographerUrl: bestPhoto.photographer_url || "https://www.pexels.com",
    url: bestPhoto.url || "https://www.pexels.com",
  };
}

function chooseBestPexelsPhoto(photos, category, query, excludeIds = []) {
  const blockedTerms = [
    "blood", "knife", "weapon", "scary", "horror", "alcohol", "beer", "wine", "cocktail",
    "cigarette", "smoke", "nude", "dead", "injury", "monster", "dark", "creepy",
  ];
  const preferredTerms = ["cute", "bright", "colorful", "happy", "playful", "friendly", "soft", "kid", "child"];
  const categoryTerms = {
    animals: ["pet", "cute", "friendly"],
    food: ["fresh", "fruit", "colorful"],
    nature: ["sunny", "green", "bright"],
    things: ["clean", "simple", "colorful"],
    body: ["simple", "learning", "friendly"],
    colors: ["bright", "colorful"],
    numbers: ["counting", "toy", "blocks"],
  };

  const safePhotos = [...photos]
    .filter((photo) => {
      const text = `${photo.alt || ""} ${photo.url || ""}`.toLowerCase();
      return !blockedTerms.some((term) => text.includes(term));
    });
  const withoutDuplicates = safePhotos.filter((photo) => !excludeIds.includes(String(photo.id)));
  const pool = withoutDuplicates.length ? withoutDuplicates : safePhotos;

  return pool
    .sort((a, b) => scorePexelsPhoto(b, preferredTerms, categoryTerms[category] || [], query) - scorePexelsPhoto(a, preferredTerms, categoryTerms[category] || [], query))[0] || null;
}

function scorePexelsPhoto(photo, preferredTerms, categoryTerms, query) {
  const text = `${photo.alt || ""} ${photo.url || ""}`.toLowerCase();
  const tokens = String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["photo", "single", "bright", "simple", "clean", "object", "scene", "daylight", "background"].includes(token));
  let score = 0;

  for (const term of preferredTerms) {
    if (text.includes(term)) score += 2;
  }

  for (const term of categoryTerms) {
    if (text.includes(term)) score += 3;
  }

  if (photo.width && photo.height && Math.abs(photo.width - photo.height) < 700) {
    score += 1;
  }

  for (const token of tokens) {
    if (text.includes(token)) score += 5;
  }

  return score;
}

function chooseBestPixabayPhoto(photos, category, query, excludeIds = []) {
  const safePhotos = [...photos].filter((photo) => !excludeIds.includes(String(photo.id)));
  const pool = safePhotos.length ? safePhotos : photos;

  return pool
    .sort((a, b) => scorePixabayPhoto(b, category, query) - scorePixabayPhoto(a, category, query))[0] || null;
}

function scorePixabayPhoto(photo, category, query) {
  const text = `${photo.tags || ""} ${photo.type || ""}`.toLowerCase();
  const tokens = String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["photo", "single", "bright", "simple", "clean", "object", "scene", "daylight", "background"].includes(token));

  let score = 0;
  for (const token of tokens) {
    if (text.includes(token)) score += 6;
  }

  if (PIXABAY_CATEGORY_KEYWORDS[category]) {
    for (const term of PIXABAY_CATEGORY_KEYWORDS[category]) {
      if (text.includes(term)) score += 3;
    }
  }

  if (photo.imageWidth && photo.imageHeight && photo.imageWidth >= 500 && photo.imageHeight >= 500) {
    score += 2;
  }

  if (typeof photo.likes === "number") score += Math.min(photo.likes / 30, 4);
  if (typeof photo.downloads === "number") score += Math.min(photo.downloads / 5000, 3);

  return score;
}

function isPexelsConfigured() {
  return Boolean(PEXELS_API_KEY && !PEXELS_API_KEY.startsWith("your_"));
}

function isPixabayConfigured() {
  return Boolean(PIXABAY_API_KEY && !PIXABAY_API_KEY.startsWith("your_"));
}
