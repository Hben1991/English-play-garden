/* ============================================================
   Din's English Garden — app.js
   A playful English word app for young children on the spectrum.
   Expanded word set · numbers play · tap-to-spell · celebrations
   ============================================================ */

// === CATEGORIES ===

const CATEGORIES = [
  { key: "all", label: "All", icon: "\u2B50", color: "#FFB74D", bg: "#FFF8E1" },
  { key: "animals", label: "Animals", icon: "\uD83D\uDC3E", color: "#FF8A65", bg: "#FBE9E7" },
  { key: "food", label: "Food", icon: "\uD83C\uDF4E", color: "#FFB74D", bg: "#FFF8E1" },
  { key: "nature", label: "Nature", icon: "\u2600\uFE0F", color: "#66BB6A", bg: "#E8F5E9" },
  { key: "things", label: "Things", icon: "\uD83C\uDF88", color: "#42A5F5", bg: "#E3F2FD" },
  { key: "body", label: "Body", icon: "\u270B", color: "#AB47BC", bg: "#F3E5F5" },
  { key: "numbers", label: "Numbers", icon: "\uD83D\uDD22", color: "#26A69A", bg: "#E0F2F1" },
  { key: "colors", label: "Colors", icon: "\uD83C\uDFA8", color: "#E91E63", bg: "#FCE4EC" },
];

const GAME_MODES = [
  { key: "spell", label: "Spell", icon: "\u270F\uFE0F" },
  { key: "pattern", label: "Patterns", icon: "\uD83D\uDD2E" },
  { key: "memory", label: "Memory", icon: "\uD83E\uDDE0" },
  { key: "sort", label: "Sort", icon: "\uD83D\uDCE6" },
];

// === WORD DATA ===

function frame(inner, bg) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" rx="40" fill="${bg}"/>${inner}</svg>`;
}

function countDots(count, fill) {
  const positions = [
    [62, 120], [100, 120], [138, 120],
    [62, 146], [100, 146], [138, 146],
    [62, 172], [100, 172], [138, 172],
    [100, 94],
  ];
  return positions.slice(0, count).map(([cx, cy]) => (
    `<circle cx="${cx}" cy="${cy}" r="10" fill="${fill}" opacity="0.95"/>`
  )).join("");
}

function numberArt(value, bg, accent, soft) {
  return frame(`
    <circle cx="100" cy="76" r="46" fill="${soft}" opacity="0.55"/>
    <text x="100" y="92" text-anchor="middle" font-family="Fredoka, Trebuchet MS, sans-serif" font-size="56" font-weight="700" fill="${accent}">${value}</text>
    <rect x="34" y="104" width="132" height="82" rx="24" fill="rgba(255,255,255,0.7)"/>
    ${countDots(value, accent)}
  `, bg);
}

const WORDS = [
  // ── Animals (12) ──
  { key: "dog", word: "DOG", label: "dog", category: "animals", sound: "Woof woof!",
    colors: ["#F7E0B5","#F59D55","#8B5D3D"],
    art: frame(`<ellipse cx="100" cy="146" rx="50" ry="8" fill="rgba(0,0,0,0.06)"/><circle cx="100" cy="95" r="44" fill="#F0B16F"/><ellipse cx="68" cy="68" rx="16" ry="28" fill="#8B5D3D" transform="rotate(-20,68,68)"/><ellipse cx="132" cy="68" rx="16" ry="28" fill="#8B5D3D" transform="rotate(20,132,68)"/><circle cx="85" cy="90" r="7" fill="#3E2723"/><circle cx="115" cy="90" r="7" fill="#3E2723"/><ellipse cx="100" cy="112" rx="20" ry="14" fill="#FDE8D1"/><circle cx="100" cy="105" r="6" fill="#3E2723"/><path d="M90 118 Q100 128 110 118" fill="none" stroke="#3E2723" stroke-width="4" stroke-linecap="round"/>`, "#F7E0B5") },

  { key: "cat", word: "CAT", label: "cat", category: "animals", sound: "Meow!",
    colors: ["#FEE3D5","#FFB57F","#7A4D39"],
    art: frame(`<ellipse cx="100" cy="146" rx="50" ry="8" fill="rgba(0,0,0,0.06)"/><path d="M64 60 L80 32 L88 62" fill="#FFB57F"/><path d="M136 60 L120 32 L112 62" fill="#FFB57F"/><circle cx="100" cy="92" r="42" fill="#FFB57F"/><circle cx="84" cy="88" r="6" fill="#4F342B"/><circle cx="116" cy="88" r="6" fill="#4F342B"/><path d="M100 98 l-8 8 h16 z" fill="#F17F8D"/><path d="M88 110 Q100 120 112 110" fill="none" stroke="#4F342B" stroke-width="4" stroke-linecap="round"/><path d="M70 102 H48 M70 108 H50 M130 102 H152 M130 108 H150" stroke="#4F342B" stroke-width="3" stroke-linecap="round"/>`, "#FEE3D5") },

  { key: "fish", word: "FISH", label: "fish", category: "animals", sound: "Splash splash!",
    colors: ["#DFF7FB","#7AD2E2","#286579"],
    art: frame(`<ellipse cx="94" cy="100" rx="44" ry="32" fill="#7AD2E2"/><path d="M134 100 L166 72 V128 Z" fill="#48A9BF"/><path d="M76 100 Q94 78 112 100 Q94 120 76 100" fill="#DFF7FB" opacity="0.7"/><circle cx="78" cy="94" r="6" fill="#245A69"/><circle cx="80" cy="92" r="2.5" fill="#fff"/><path d="M60 140 Q84 126 110 138" fill="none" stroke="rgba(74,133,176,0.2)" stroke-width="6" stroke-linecap="round"/><path d="M72 154 Q102 140 134 150" fill="none" stroke="rgba(74,133,176,0.12)" stroke-width="6" stroke-linecap="round"/>`, "#DFF7FB") },

  { key: "bird", word: "BIRD", label: "bird", category: "animals", sound: "Tweet tweet!",
    colors: ["#F9E4FF","#D79CF8","#70459F"],
    art: frame(`<ellipse cx="94" cy="102" rx="40" ry="32" fill="#D79CF8"/><circle cx="122" cy="88" r="22" fill="#D79CF8"/><path d="M142 88 L162 96 L142 104 Z" fill="#F7BC5B"/><circle cx="126" cy="84" r="5" fill="#4D3367"/><path d="M76 102 Q94 78 118 98" fill="#F5D8FF" opacity="0.7"/><path d="M62 142 Q82 126 106 140" fill="none" stroke="#8A62B8" stroke-width="5" stroke-linecap="round"/>`, "#F9E4FF") },

  { key: "duck", word: "DUCK", label: "duck", category: "animals", sound: "Quack quack!",
    colors: ["#FFF9C4","#FFEE58","#F9A825"],
    art: frame(`<ellipse cx="100" cy="148" rx="56" ry="8" fill="rgba(0,0,0,0.05)"/><ellipse cx="100" cy="112" rx="42" ry="34" fill="#FFEE58"/><circle cx="100" cy="76" r="28" fill="#FFEE58"/><circle cx="88" cy="72" r="5" fill="#3E2723"/><circle cx="112" cy="72" r="5" fill="#3E2723"/><ellipse cx="100" cy="86" rx="14" ry="8" fill="#FF8F00"/>`, "#FFF9C4") },

  { key: "cow", word: "COW", label: "cow", category: "animals", sound: "Moo!",
    colors: ["#F5F5F5","#E0E0E0","#424242"],
    art: frame(`<ellipse cx="100" cy="148" rx="50" ry="8" fill="rgba(0,0,0,0.06)"/><circle cx="100" cy="92" r="44" fill="#F5F5F5"/><ellipse cx="66" cy="64" rx="18" ry="10" fill="#FFCC80" transform="rotate(-30,66,64)"/><ellipse cx="134" cy="64" rx="18" ry="10" fill="#FFCC80" transform="rotate(30,134,64)"/><circle cx="78" cy="78" r="18" fill="#424242" opacity="0.7"/><circle cx="84" cy="88" r="6" fill="#3E2723"/><circle cx="116" cy="88" r="6" fill="#3E2723"/><ellipse cx="100" cy="112" rx="22" ry="16" fill="#FFCC80"/><circle cx="92" cy="110" r="4" fill="#5D4037"/><circle cx="108" cy="110" r="4" fill="#5D4037"/>`, "#F5F5F5") },

  { key: "pig", word: "PIG", label: "pig", category: "animals", sound: "Oink oink!",
    colors: ["#FCE4EC","#F48FB1","#C2185B"],
    art: frame(`<ellipse cx="100" cy="148" rx="50" ry="8" fill="rgba(0,0,0,0.05)"/><circle cx="100" cy="94" r="44" fill="#F48FB1"/><circle cx="80" cy="80" r="6" fill="#880E4F"/><circle cx="120" cy="80" r="6" fill="#880E4F"/><ellipse cx="100" cy="106" rx="22" ry="16" fill="#F8BBD0"/><circle cx="92" cy="104" r="5" fill="#C2185B"/><circle cx="108" cy="104" r="5" fill="#C2185B"/><ellipse cx="74" cy="62" rx="14" ry="18" fill="#F48FB1" transform="rotate(-20,74,62)"/><ellipse cx="126" cy="62" rx="14" ry="18" fill="#F48FB1" transform="rotate(20,126,62)"/>`, "#FCE4EC") },

  { key: "bee", word: "BEE", label: "bee", category: "animals", sound: "Buzz buzz!",
    colors: ["#FFF9C4","#FFEE58","#F57F17"],
    art: frame(`<ellipse cx="100" cy="104" rx="36" ry="30" fill="#FFEE58"/><rect x="70" y="92" width="60" height="8" rx="4" fill="#3E2723"/><rect x="72" y="108" width="56" height="8" rx="4" fill="#3E2723"/><circle cx="88" cy="82" r="5" fill="#3E2723"/><circle cx="112" cy="82" r="5" fill="#3E2723"/><path d="M90 130 Q100 140 110 130" fill="none" stroke="#3E2723" stroke-width="3" stroke-linecap="round"/><ellipse cx="78" cy="66" rx="18" ry="12" fill="rgba(200,230,255,0.6)" transform="rotate(-30,78,66)"/><ellipse cx="122" cy="66" rx="18" ry="12" fill="rgba(200,230,255,0.6)" transform="rotate(30,122,66)"/>`, "#FFF9C4") },

  { key: "bear", word: "BEAR", label: "bear", category: "animals", sound: "Grrr!",
    colors: ["#EFEBE9","#A1887F","#5D4037"],
    art: frame(`<ellipse cx="100" cy="148" rx="50" ry="8" fill="rgba(0,0,0,0.06)"/><circle cx="72" cy="56" r="18" fill="#8D6E63"/><circle cx="128" cy="56" r="18" fill="#8D6E63"/><circle cx="72" cy="56" r="10" fill="#A1887F"/><circle cx="128" cy="56" r="10" fill="#A1887F"/><circle cx="100" cy="92" r="44" fill="#A1887F"/><circle cx="84" cy="84" r="6" fill="#3E2723"/><circle cx="116" cy="84" r="6" fill="#3E2723"/><ellipse cx="100" cy="104" rx="16" ry="12" fill="#D7CCC8"/><circle cx="100" cy="98" r="6" fill="#3E2723"/><path d="M92 112 Q100 120 108 112" fill="none" stroke="#3E2723" stroke-width="3.5" stroke-linecap="round"/>`, "#EFEBE9") },

  { key: "hen", word: "HEN", label: "hen", category: "animals", sound: "Cluck cluck!",
    colors: ["#FFF3E0","#FF8A65","#BF360C"],
    art: frame(`<ellipse cx="100" cy="148" rx="50" ry="8" fill="rgba(0,0,0,0.05)"/><ellipse cx="100" cy="110" rx="40" ry="32" fill="#FFAB91"/><circle cx="100" cy="72" r="26" fill="#FFAB91"/><circle cx="90" cy="68" r="5" fill="#3E2723"/><path d="M110 76 L130 72 L110 84 Z" fill="#FF6F00"/><path d="M94 46 Q100 28 106 46" fill="#F44336"/><ellipse cx="106" cy="92" rx="6" ry="8" fill="#F44336"/>`, "#FFF3E0") },

  { key: "bug", word: "BUG", label: "bug", category: "animals", sound: "Bzzt!",
    colors: ["#FFEBEE","#EF5350","#B71C1C"],
    art: frame(`<circle cx="100" cy="106" r="36" fill="#EF5350"/><line x1="100" y1="70" x2="100" y2="142" stroke="#B71C1C" stroke-width="4"/><circle cx="82" cy="96" r="8" fill="#B71C1C" opacity="0.5"/><circle cx="118" cy="96" r="8" fill="#B71C1C" opacity="0.5"/><circle cx="88" cy="120" r="6" fill="#B71C1C" opacity="0.5"/><circle cx="112" cy="120" r="6" fill="#B71C1C" opacity="0.5"/><circle cx="100" cy="66" r="18" fill="#424242"/><circle cx="92" cy="62" r="5" fill="#FFF"/><circle cx="108" cy="62" r="5" fill="#FFF"/><circle cx="92" cy="62" r="2.5" fill="#212121"/><circle cx="108" cy="62" r="2.5" fill="#212121"/><path d="M82 44 Q76 28 68 24 M118 44 Q124 28 132 24" stroke="#424242" stroke-width="3" stroke-linecap="round" fill="none"/>`, "#FFEBEE") },

  { key: "fox", word: "FOX", label: "fox", category: "animals", sound: "Yip yip!",
    colors: ["#FBE9E7","#FF7043","#BF360C"],
    art: frame(`<ellipse cx="100" cy="148" rx="50" ry="8" fill="rgba(0,0,0,0.05)"/><circle cx="100" cy="96" r="40" fill="#FF7043"/><path d="M64 58 L76 28 L88 62" fill="#FF7043"/><path d="M136 58 L124 28 L112 62" fill="#FF7043"/><path d="M64 58 L76 28 L88 62" fill="#BF360C" opacity="0.3"/><path d="M136 58 L124 28 L112 62" fill="#BF360C" opacity="0.3"/><circle cx="84" cy="88" r="6" fill="#3E2723"/><circle cx="116" cy="88" r="6" fill="#3E2723"/><ellipse cx="100" cy="108" rx="18" ry="14" fill="#FFF8E1"/><circle cx="100" cy="104" r="5" fill="#3E2723"/><path d="M92 116 Q100 124 108 116" fill="none" stroke="#3E2723" stroke-width="3" stroke-linecap="round"/>`, "#FBE9E7") },

  // ── Food (7) ──
  { key: "egg", word: "EGG", label: "egg", category: "food", sound: "Crack!",
    colors: ["#FFF8E1","#FFE082","#F57F17"],
    art: frame(`<ellipse cx="100" cy="146" rx="44" ry="8" fill="rgba(0,0,0,0.05)"/><ellipse cx="100" cy="96" rx="38" ry="48" fill="#FFF8E1" stroke="#FFE082" stroke-width="4"/><circle cx="100" cy="96" r="22" fill="#FFD54F"/>`, "#FFF8E1") },

  { key: "milk", word: "MILK", label: "milk", category: "food", sound: "Glug glug!",
    colors: ["#ECF8FF","#BFE6FB","#4A88A5"],
    art: frame(`<path d="M68 52 H132 L122 150 H78 Z" fill="#BFE6FB"/><path d="M78 62 H122 L116 142 H84 Z" fill="#FFF"/><rect x="78" y="40" width="36" height="20" rx="6" fill="#4A88A5"/><path d="M88 108 Q100 118 112 108" fill="none" stroke="#4A88A5" stroke-width="4" stroke-linecap="round"/><circle cx="90" cy="92" r="5" fill="#4A88A5"/><circle cx="110" cy="92" r="5" fill="#4A88A5"/>`, "#ECF8FF") },

  { key: "cake", word: "CAKE", label: "cake", category: "food", sound: "Yum yum!",
    colors: ["#FCE4EC","#F48FB1","#AD1457"],
    art: frame(`<rect x="50" y="90" width="100" height="56" rx="14" fill="#F48FB1"/><rect x="54" y="80" width="92" height="20" rx="10" fill="#FFCDD2"/><rect x="42" y="74" width="116" height="16" rx="8" fill="#F8BBD0"/><path d="M60 74 Q68 50 76 74 M88 74 Q96 46 104 74 M116 74 Q124 50 132 74" fill="none" stroke="#FFCDD2" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="62" r="8" fill="#F44336"/><rect x="98" y="44" width="4" height="18" rx="2" fill="#4CAF50"/>`, "#FCE4EC") },

  { key: "pie", word: "PIE", label: "pie", category: "food", sound: "Mmm!",
    colors: ["#FFF3E0","#FFB74D","#E65100"],
    art: frame(`<ellipse cx="100" cy="140" rx="56" ry="10" fill="rgba(0,0,0,0.05)"/><ellipse cx="100" cy="110" rx="54" ry="22" fill="#FFB74D"/><path d="M46 110 Q46 74 100 74 Q154 74 154 110" fill="#FFCC80"/><path d="M60 88 L140 88 M80 76 L80 110 M120 76 L120 110" stroke="#E65100" stroke-width="3" opacity="0.4"/>`, "#FFF3E0") },

  { key: "jam", word: "JAM", label: "jam", category: "food", sound: "Yummy!",
    colors: ["#FCE4EC","#E57373","#B71C1C"],
    art: frame(`<rect x="62" y="60" width="76" height="88" rx="12" fill="#E57373"/><rect x="62" y="54" width="76" height="22" rx="8" fill="#FFCDD2"/><rect x="56" y="46" width="88" height="16" rx="8" fill="#EF9A9A"/><rect x="74" y="92" width="52" height="20" rx="6" fill="#FFF" opacity="0.8"/><circle cx="90" cy="126" r="6" fill="#B71C1C" opacity="0.4"/><circle cx="110" cy="120" r="5" fill="#B71C1C" opacity="0.4"/>`, "#FCE4EC") },

  { key: "ice", word: "ICE", label: "ice cream", category: "food", sound: "Lick lick!",
    colors: ["#FFF9C4","#FFF176","#F48FB1"],
    art: frame(`<path d="M78 100 L100 164 L122 100" fill="#FFCC80"/><circle cx="100" cy="84" r="30" fill="#F48FB1"/><circle cx="82" cy="74" r="16" fill="#CE93D8"/><circle cx="118" cy="74" r="16" fill="#FFF176"/><circle cx="100" cy="62" r="8" fill="#EF5350"/>`, "#FFF9C4") },

  { key: "cup", word: "CUP", label: "cup", category: "food", sound: "Sip!",
    colors: ["#E3F2FD","#64B5F6","#1565C0"],
    art: frame(`<path d="M62 60 H138 L128 152 H72 Z" fill="#64B5F6"/><path d="M72 72 H128 L122 142 H78 Z" fill="#BBDEFB"/><path d="M138 78 Q168 78 168 108 Q168 138 138 138" fill="none" stroke="#64B5F6" stroke-width="8" stroke-linecap="round"/><path d="M82 100 Q100 80 118 100" fill="none" stroke="#1565C0" stroke-width="4" stroke-linecap="round" opacity="0.3"/>`, "#E3F2FD") },

  // ── Nature (7) ──
  { key: "sun", word: "SUN", label: "sun", category: "nature",
    colors: ["#FFF9C4","#FFCA58","#FF8A3D"],
    art: frame(`<circle cx="100" cy="96" r="40" fill="#FFCA58"/><circle cx="100" cy="96" r="26" fill="#FFE59A"/><g stroke="#FF9C3A" stroke-width="8" stroke-linecap="round"><path d="M100 30 V50"/><path d="M100 142 V162"/><path d="M34 96 H54"/><path d="M146 96 H166"/><path d="M53 49 L67 63"/><path d="M133 129 L147 143"/><path d="M53 143 L67 129"/><path d="M133 63 L147 49"/></g><path d="M86 100 Q100 116 114 100" fill="none" stroke="#C36D20" stroke-width="5" stroke-linecap="round"/><circle cx="86" cy="86" r="5" fill="#C36D20"/><circle cx="114" cy="86" r="5" fill="#C36D20"/>`, "#FFF9C4") },

  { key: "moon", word: "MOON", label: "moon", category: "nature",
    colors: ["#EEF0FF","#C1CBFF","#6B78C3"],
    art: frame(`<rect x="20" y="20" width="160" height="160" rx="40" fill="#283593"/><path d="M114 52 A40 40 0 1 0 132 130 A32 32 0 1 1 114 52 Z" fill="#FFF9C4"/><circle cx="60" cy="56" r="4" fill="#C5CAE9"/><circle cx="148" cy="72" r="5" fill="#C5CAE9"/><circle cx="134" cy="118" r="6" fill="#C5CAE9"/><circle cx="70" cy="128" r="3.5" fill="#C5CAE9"/><circle cx="52" cy="92" r="2.5" fill="#C5CAE9"/>`, "#E8EAF6") },

  { key: "star", word: "STAR", label: "star", category: "nature",
    colors: ["#FFF9C4","#FFD54F","#FF8F00"],
    art: frame(`<polygon points="100,24 118,76 174,80 130,116 144,172 100,144 56,172 70,116 26,80 82,76" fill="#FFD54F"/><circle cx="90" cy="100" r="6" fill="#F57F17"/><circle cx="114" cy="100" r="6" fill="#F57F17"/><path d="M94 118 Q102 128 110 118" fill="none" stroke="#F57F17" stroke-width="4" stroke-linecap="round"/>`, "#FFF9C4") },

  { key: "tree", word: "TREE", label: "tree", category: "nature",
    colors: ["#E8F5E9","#66BB6A","#33691E"],
    art: frame(`<rect x="88" y="108" width="24" height="48" rx="8" fill="#795548"/><circle cx="100" cy="78" r="34" fill="#66BB6A"/><circle cx="72" cy="94" r="24" fill="#4CAF50"/><circle cx="128" cy="94" r="24" fill="#4CAF50"/><ellipse cx="100" cy="158" rx="54" ry="8" fill="rgba(76,175,80,0.12)"/><circle cx="130" cy="52" r="10" fill="#FFF176"/>`, "#E8F5E9") },

  { key: "rain", word: "RAIN", label: "rain", category: "nature",
    colors: ["#E3F2FD","#90CAF9","#1565C0"],
    art: frame(`<ellipse cx="100" cy="72" rx="52" ry="28" fill="#90CAF9"/><circle cx="60" cy="68" r="24" fill="#90CAF9"/><circle cx="140" cy="68" r="24" fill="#90CAF9"/><path d="M62 108 L58 128" stroke="#42A5F5" stroke-width="5" stroke-linecap="round"/><path d="M86 112 L82 136" stroke="#42A5F5" stroke-width="5" stroke-linecap="round"/><path d="M110 108 L106 132" stroke="#42A5F5" stroke-width="5" stroke-linecap="round"/><path d="M134 112 L130 128" stroke="#42A5F5" stroke-width="5" stroke-linecap="round"/><path d="M74 126 L70 146" stroke="#42A5F5" stroke-width="5" stroke-linecap="round"/><path d="M122 124 L118 144" stroke="#42A5F5" stroke-width="5" stroke-linecap="round"/>`, "#E3F2FD") },

  { key: "leaf", word: "LEAF", label: "leaf", category: "nature",
    colors: ["#E8F5E9","#81C784","#2E7D32"],
    art: frame(`<path d="M100 36 Q160 60 160 120 Q160 170 100 170 Q40 170 40 120 Q40 60 100 36 Z" fill="#81C784"/><path d="M100 50 V160" stroke="#4CAF50" stroke-width="4"/><path d="M100 80 L130 64 M100 100 L66 84 M100 120 L136 106 M100 140 L72 126" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" fill="none"/>`, "#E8F5E9") },

  { key: "sea", word: "SEA", label: "sea", category: "nature",
    colors: ["#E3F2FD","#42A5F5","#0D47A1"],
    art: frame(`<rect x="20" y="80" width="160" height="100" rx="20" fill="#42A5F5"/><path d="M20 96 Q50 80 80 96 Q110 112 140 96 Q160 86 180 96" fill="#64B5F6"/><path d="M20 118 Q50 102 80 118 Q110 134 140 118 Q160 108 180 118" fill="#42A5F5"/><circle cx="100" cy="52" r="20" fill="#FFD54F"/><path d="M34 140 Q64 124 94 140 Q124 156 154 140" fill="none" stroke="#90CAF9" stroke-width="4" stroke-linecap="round"/>`, "#E3F2FD") },

  // ── Things (10) ──
  { key: "ball", word: "BALL", label: "ball", category: "things",
    colors: ["#FFEBEE","#EF5350","#C62828"],
    art: frame(`<ellipse cx="100" cy="154" rx="44" ry="8" fill="rgba(0,0,0,0.06)"/><circle cx="100" cy="98" r="42" fill="#EF5350"/><path d="M58 98 H142" stroke="#FFCDD2" stroke-width="6"/><path d="M100 56 V140" stroke="#FFCDD2" stroke-width="6"/><path d="M68 66 Q100 98 68 130" fill="none" stroke="#42A5F5" stroke-width="6"/><path d="M132 66 Q100 98 132 130" fill="none" stroke="#42A5F5" stroke-width="6"/>`, "#FFEBEE") },

  { key: "car", word: "CAR", label: "car", category: "things", sound: "Vroom vroom!",
    colors: ["#FFEBEE","#EF5350","#B71C1C"],
    art: frame(`<rect x="30" y="84" width="140" height="44" rx="14" fill="#EF5350"/><path d="M56 84 L72 56 H128 L144 84" fill="#EF5350"/><rect x="76" y="62" width="22" height="18" rx="4" fill="#BBDEFB"/><rect x="104" y="62" width="32" height="18" rx="4" fill="#BBDEFB"/><circle cx="64" cy="134" r="14" fill="#424242"/><circle cx="136" cy="134" r="14" fill="#424242"/><circle cx="64" cy="134" r="6" fill="#9E9E9E"/><circle cx="136" cy="134" r="6" fill="#9E9E9E"/>`, "#FFEBEE") },

  { key: "bus", word: "BUS", label: "bus", category: "things",
    colors: ["#FFF8E1","#FFB74D","#E65100"],
    art: frame(`<rect x="30" y="58" width="140" height="68" rx="18" fill="#FFB74D"/><rect x="44" y="70" width="30" height="22" rx="6" fill="#FFF9C4"/><rect x="82" y="70" width="30" height="22" rx="6" fill="#FFF9C4"/><rect x="120" y="70" width="20" height="38" rx="6" fill="#FFF9C4"/><circle cx="62" cy="134" r="14" fill="#424242"/><circle cx="138" cy="134" r="14" fill="#424242"/><circle cx="62" cy="134" r="6" fill="#9E9E9E"/><circle cx="138" cy="134" r="6" fill="#9E9E9E"/><rect x="48" y="100" width="54" height="8" rx="4" fill="#FF8F00"/>`, "#FFF8E1") },

  { key: "toy", word: "TOY", label: "toy", category: "things",
    colors: ["#EFEBE9","#A1887F","#5D4037"],
    art: frame(`<ellipse cx="100" cy="150" rx="46" ry="8" fill="rgba(0,0,0,0.05)"/><ellipse cx="100" cy="110" rx="34" ry="38" fill="#A1887F"/><circle cx="100" cy="68" r="26" fill="#A1887F"/><circle cx="82" cy="52" r="12" fill="#A1887F"/><circle cx="118" cy="52" r="12" fill="#A1887F"/><circle cx="82" cy="52" r="6" fill="#BCAAA4"/><circle cx="118" cy="52" r="6" fill="#BCAAA4"/><circle cx="92" cy="66" r="5" fill="#3E2723"/><circle cx="108" cy="66" r="5" fill="#3E2723"/><ellipse cx="100" cy="80" rx="8" ry="6" fill="#3E2723"/>`, "#EFEBE9") },

  { key: "hat", word: "HAT", label: "hat", category: "things",
    colors: ["#FFEBEE","#EF5350","#B71C1C"],
    art: frame(`<ellipse cx="100" cy="136" rx="62" ry="14" fill="#EF5350"/><path d="M56 136 Q56 60 100 46 Q144 60 144 136" fill="#EF5350"/><rect x="38" y="128" width="124" height="16" rx="8" fill="#C62828"/><rect x="80" y="82" width="40" height="12" rx="6" fill="#FFCDD2"/>`, "#FFEBEE") },

  { key: "bed", word: "BED", label: "bed", category: "things",
    colors: ["#E3F2FD","#90CAF9","#1565C0"],
    art: frame(`<rect x="30" y="80" width="140" height="50" rx="8" fill="#90CAF9"/><rect x="34" y="70" width="80" height="30" rx="6" fill="#BBDEFB"/><rect x="30" y="60" width="20" height="80" rx="6" fill="#64B5F6"/><rect x="150" y="92" width="20" height="48" rx="6" fill="#64B5F6"/><rect x="34" y="88" width="112" height="36" rx="4" fill="#E3F2FD"/><ellipse cx="72" cy="78" rx="16" ry="12" fill="#FFF"/>`, "#E3F2FD") },

  { key: "box", word: "BOX", label: "box", category: "things",
    colors: ["#EFEBE9","#BCAAA4","#5D4037"],
    art: frame(`<rect x="40" y="72" width="120" height="82" rx="8" fill="#BCAAA4"/><rect x="40" y="56" width="120" height="24" rx="8" fill="#A1887F"/><path d="M100 56 V72" stroke="#8D6E63" stroke-width="4"/><rect x="90" y="60" width="20" height="12" rx="4" fill="#8D6E63"/>`, "#EFEBE9") },

  { key: "key", word: "KEY", label: "key", category: "things",
    colors: ["#FFF8E1","#FFD54F","#FF8F00"],
    art: frame(`<circle cx="82" cy="78" r="28" fill="#FFD54F" stroke="#FF8F00" stroke-width="4"/><circle cx="82" cy="78" r="14" fill="#FFF8E1"/><rect x="106" y="72" width="60" height="12" rx="6" fill="#FFD54F"/><rect x="148" y="72" width="12" height="28" rx="4" fill="#FFD54F"/><rect x="134" y="72" width="10" height="22" rx="4" fill="#FFD54F"/>`, "#FFF8E1") },

  { key: "bag", word: "BAG", label: "bag", category: "things",
    colors: ["#EFEBE9","#A1887F","#5D4037"],
    art: frame(`<rect x="46" y="68" width="108" height="86" rx="14" fill="#A1887F"/><path d="M70 68 Q70 38 100 38 Q130 38 130 68" fill="none" stroke="#8D6E63" stroke-width="8" stroke-linecap="round"/><rect x="80" y="88" width="40" height="8" rx="4" fill="#8D6E63"/>`, "#EFEBE9") },

  { key: "book", word: "BOOK", label: "book", category: "things",
    colors: ["#FFF3E0","#FF9D70","#5F4F7B"],
    art: frame(`<path d="M46 44 H100 V156 H46 Q34 156 34 144 V56 Q34 44 46 44 Z" fill="#FF9D70"/><path d="M100 44 H154 Q166 44 166 56 V144 Q166 156 154 156 H100 Z" fill="#FFCC80"/><path d="M100 44 V156" stroke="#5F4F7B" stroke-width="6"/><path d="M56 68 H90 M56 84 H90 M56 100 H90" stroke="#FFF" stroke-width="4" stroke-linecap="round"/><path d="M110 68 H152 M110 84 H152 M110 100 H152" stroke="#BF8F6F" stroke-width="4" stroke-linecap="round"/>`, "#FFF3E0") },

  // ── Body (6) ──
  { key: "eye", word: "EYE", label: "eye", category: "body",
    colors: ["#F3E5F5","#CE93D8","#6A1B9A"],
    art: frame(`<path d="M28 100 Q100 30 172 100 Q100 170 28 100 Z" fill="#FFF"/><circle cx="100" cy="100" r="30" fill="#8D6E63"/><circle cx="100" cy="100" r="16" fill="#212121"/><circle cx="108" cy="92" r="6" fill="#FFF"/><path d="M28 100 Q100 30 172 100 Q100 170 28 100 Z" fill="none" stroke="#CE93D8" stroke-width="6"/>`, "#F3E5F5") },

  { key: "ear", word: "EAR", label: "ear", category: "body",
    colors: ["#FFF3E0","#FFCC80","#E65100"],
    art: frame(`<path d="M112 40 Q160 40 160 100 Q160 160 120 160 Q100 160 100 140 Q100 120 112 112 Q80 104 80 76 Q80 40 112 40 Z" fill="#FFCC80" stroke="#FFB74D" stroke-width="4"/><path d="M120 68 Q140 68 140 96 Q140 120 124 124" fill="none" stroke="#FFB74D" stroke-width="6" stroke-linecap="round"/>`, "#FFF3E0") },

  { key: "nose", word: "NOSE", label: "nose", category: "body",
    colors: ["#FFF3E0","#FFCC80","#E65100"],
    art: frame(`<path d="M100 34 Q120 80 130 130 Q100 152 70 130 Q80 80 100 34 Z" fill="#FFCC80" stroke="#FFB74D" stroke-width="4"/><circle cx="84" cy="126" r="8" fill="#FFB74D"/><circle cx="116" cy="126" r="8" fill="#FFB74D"/>`, "#FFF3E0") },

  { key: "hand", word: "HAND", label: "hand", category: "body",
    colors: ["#FFF3E0","#FFCC80","#E65100"],
    art: frame(`<rect x="60" y="90" width="80" height="70" rx="20" fill="#FFCC80"/><rect x="62" y="40" width="18" height="60" rx="9" fill="#FFCC80"/><rect x="84" y="30" width="18" height="70" rx="9" fill="#FFCC80"/><rect x="106" y="36" width="18" height="64" rx="9" fill="#FFCC80"/><rect x="128" y="48" width="16" height="52" rx="8" fill="#FFCC80"/><path d="M60 112 L40 90" stroke="#FFCC80" stroke-width="18" stroke-linecap="round"/>`, "#FFF3E0") },

  { key: "leg", word: "LEG", label: "leg", category: "body",
    colors: ["#E3F2FD","#90CAF9","#1565C0"],
    art: frame(`<rect x="78" y="28" width="44" height="100" rx="20" fill="#FFCC80"/><rect x="68" y="118" width="64" height="32" rx="10" fill="#42A5F5"/><rect x="60" y="128" width="80" height="30" rx="12" fill="#1E88E5"/>`, "#E3F2FD") },

  { key: "toe", word: "TOE", label: "toe", category: "body",
    colors: ["#FFF3E0","#FFCC80","#E65100"],
    art: frame(`<ellipse cx="100" cy="120" rx="60" ry="30" fill="#FFCC80"/><circle cx="60" cy="100" r="14" fill="#FFCC80"/><circle cx="78" cy="90" r="16" fill="#FFCC80"/><circle cx="100" cy="86" r="17" fill="#FFCC80"/><circle cx="122" cy="90" r="16" fill="#FFCC80"/><circle cx="140" cy="100" r="14" fill="#FFCC80"/><circle cx="60" cy="98" r="4" fill="#FFB74D"/><circle cx="78" cy="88" r="4" fill="#FFB74D"/><circle cx="100" cy="84" r="5" fill="#FFB74D"/><circle cx="122" cy="88" r="4" fill="#FFB74D"/><circle cx="140" cy="98" r="4" fill="#FFB74D"/>`, "#FFF3E0") },

  // ── Longer words for strong spellers ──
  { key: "rabbit", word: "RABBIT", label: "rabbit", category: "animals", sound: "Hop hop!",
    colors: ["#F5F5F5", "#FFFFFF", "#F48FB1"],
    art: frame(`<ellipse cx="100" cy="150" rx="52" ry="8" fill="rgba(0,0,0,0.05)"/><ellipse cx="84" cy="62" rx="14" ry="34" fill="#FFFFFF" transform="rotate(-10,84,62)"/><ellipse cx="116" cy="62" rx="14" ry="34" fill="#FFFFFF" transform="rotate(10,116,62)"/><ellipse cx="84" cy="62" rx="6" ry="24" fill="#F8BBD0" transform="rotate(-10,84,62)"/><ellipse cx="116" cy="62" rx="6" ry="24" fill="#F8BBD0" transform="rotate(10,116,62)"/><circle cx="100" cy="104" r="42" fill="#FFFFFF"/><circle cx="86" cy="98" r="5" fill="#4E342E"/><circle cx="114" cy="98" r="5" fill="#4E342E"/><circle cx="100" cy="110" r="6" fill="#F48FB1"/><path d="M92 120 Q100 128 108 120" fill="none" stroke="#6D4C41" stroke-width="3.5" stroke-linecap="round"/>`, "#F5F5F5") },

  { key: "monkey", word: "MONKEY", label: "monkey", category: "animals", sound: "Oo oo aa aa!",
    colors: ["#EFEBE9", "#A1887F", "#5D4037"],
    art: frame(`<ellipse cx="100" cy="150" rx="52" ry="8" fill="rgba(0,0,0,0.06)"/><circle cx="72" cy="78" r="22" fill="#8D6E63"/><circle cx="128" cy="78" r="22" fill="#8D6E63"/><circle cx="72" cy="78" r="12" fill="#D7CCC8"/><circle cx="128" cy="78" r="12" fill="#D7CCC8"/><circle cx="100" cy="102" r="42" fill="#8D6E63"/><ellipse cx="100" cy="114" rx="24" ry="18" fill="#D7CCC8"/><circle cx="86" cy="96" r="5" fill="#3E2723"/><circle cx="114" cy="96" r="5" fill="#3E2723"/><circle cx="100" cy="108" r="5" fill="#3E2723"/><path d="M90 122 Q100 132 110 122" fill="none" stroke="#4E342E" stroke-width="3.5" stroke-linecap="round"/><path d="M138 118 Q166 122 160 150" fill="none" stroke="#8D6E63" stroke-width="8" stroke-linecap="round"/>`, "#EFEBE9") },

  { key: "elephant", word: "ELEPHANT", label: "elephant", category: "animals", sound: "Pawoo!",
    colors: ["#ECEFF1", "#B0BEC5", "#546E7A"],
    art: frame(`<ellipse cx="100" cy="152" rx="56" ry="8" fill="rgba(0,0,0,0.06)"/><circle cx="78" cy="90" r="30" fill="#90A4AE"/><circle cx="122" cy="90" r="30" fill="#90A4AE"/><circle cx="100" cy="102" r="44" fill="#B0BEC5"/><ellipse cx="78" cy="90" rx="16" ry="20" fill="#CFD8DC"/><ellipse cx="122" cy="90" rx="16" ry="20" fill="#CFD8DC"/><circle cx="86" cy="96" r="5" fill="#37474F"/><circle cx="114" cy="96" r="5" fill="#37474F"/><path d="M100 106 Q126 120 120 150" fill="none" stroke="#90A4AE" stroke-width="16" stroke-linecap="round"/><path d="M112 146 Q118 160 132 154" fill="none" stroke="#90A4AE" stroke-width="8" stroke-linecap="round"/>`, "#ECEFF1") },

  { key: "banana", word: "BANANA", label: "banana", category: "food", sound: "Yum!",
    colors: ["#FFFDE7", "#FFEE58", "#F9A825"],
    art: frame(`<path d="M58 112 Q80 54 146 54 Q154 92 120 126 Q92 154 58 112 Z" fill="#FFEE58"/><path d="M64 110 Q86 66 140 64" fill="none" stroke="#FFF59D" stroke-width="10" stroke-linecap="round"/><path d="M62 112 Q86 148 130 138" fill="none" stroke="#F9A825" stroke-width="5" stroke-linecap="round"/><circle cx="142" cy="56" r="6" fill="#6D4C41"/><circle cx="60" cy="112" r="5" fill="#6D4C41"/>`, "#FFFDE7") },

  { key: "cookie", word: "COOKIE", label: "cookie", category: "food", sound: "Crunch crunch!",
    colors: ["#FFF3E0", "#D7A86E", "#6D4C41"],
    art: frame(`<circle cx="100" cy="100" r="52" fill="#D7A86E"/><circle cx="74" cy="80" r="7" fill="#6D4C41"/><circle cx="122" cy="78" r="6" fill="#6D4C41"/><circle cx="92" cy="102" r="7" fill="#6D4C41"/><circle cx="126" cy="112" r="6" fill="#6D4C41"/><circle cx="80" cy="126" r="5" fill="#6D4C41"/><circle cx="106" cy="134" r="6" fill="#6D4C41"/><circle cx="58" cy="106" r="6" fill="#6D4C41"/><path d="M54 84 Q70 64 94 60" fill="none" stroke="#EBC38D" stroke-width="8" stroke-linecap="round" opacity="0.6"/>`, "#FFF3E0") },

  { key: "rainbow", word: "RAINBOW", label: "rainbow", category: "nature",
    colors: ["#E3F2FD", "#42A5F5", "#AB47BC"],
    art: frame(`<path d="M46 138 A54 54 0 0 1 154 138" fill="none" stroke="#EF5350" stroke-width="14" stroke-linecap="round"/><path d="M56 138 A44 44 0 0 1 144 138" fill="none" stroke="#FFCA28" stroke-width="14" stroke-linecap="round"/><path d="M66 138 A34 34 0 0 1 134 138" fill="none" stroke="#66BB6A" stroke-width="14" stroke-linecap="round"/><path d="M76 138 A24 24 0 0 1 124 138" fill="none" stroke="#42A5F5" stroke-width="14" stroke-linecap="round"/><path d="M86 138 A14 14 0 0 1 114 138" fill="none" stroke="#AB47BC" stroke-width="14" stroke-linecap="round"/><circle cx="54" cy="138" r="18" fill="#FFFFFF" opacity="0.9"/><circle cx="146" cy="138" r="18" fill="#FFFFFF" opacity="0.9"/><circle cx="70" cy="72" r="12" fill="#FFFFFF" opacity="0.7"/><circle cx="130" cy="64" r="10" fill="#FFFFFF" opacity="0.7"/>`, "#E3F2FD") },

  { key: "flower", word: "FLOWER", label: "flower", category: "nature",
    colors: ["#FCE4EC", "#F48FB1", "#66BB6A"],
    art: frame(`<rect x="96" y="86" width="8" height="72" rx="4" fill="#66BB6A"/><path d="M100 158 Q88 132 70 118" fill="none" stroke="#81C784" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="84" r="16" fill="#FFD54F"/><circle cx="100" cy="52" r="18" fill="#F48FB1"/><circle cx="130" cy="68" r="18" fill="#F48FB1"/><circle cx="130" cy="100" r="18" fill="#F48FB1"/><circle cx="100" cy="116" r="18" fill="#F48FB1"/><circle cx="70" cy="100" r="18" fill="#F48FB1"/><circle cx="70" cy="68" r="18" fill="#F48FB1"/>`, "#FCE4EC") },

  { key: "rocket", word: "ROCKET", label: "rocket", category: "things",
    colors: ["#E3F2FD", "#90CAF9", "#EF5350"],
    art: frame(`<path d="M100 34 Q138 72 126 126 L100 152 L74 126 Q62 72 100 34 Z" fill="#90CAF9"/><circle cx="100" cy="84" r="16" fill="#E3F2FD" stroke="#42A5F5" stroke-width="5"/><path d="M74 126 L50 138 L64 108 Z" fill="#EF5350"/><path d="M126 126 L150 138 L136 108 Z" fill="#EF5350"/><path d="M90 152 L100 176 L110 152" fill="#FFB74D"/><path d="M92 154 L100 192 L108 154" fill="#FF7043"/>`, "#E3F2FD") },

  { key: "finger", word: "FINGER", label: "finger", category: "body",
    colors: ["#FFF3E0", "#FFCC80", "#E65100"],
    art: frame(`<rect x="82" y="28" width="36" height="122" rx="18" fill="#FFCC80"/><rect x="70" y="122" width="60" height="44" rx="18" fill="#FFCC80"/><rect x="64" y="132" width="72" height="26" rx="13" fill="#FFB74D"/><path d="M90 48 H110 M90 72 H110 M90 96 H110" stroke="#FFE0B2" stroke-width="4" stroke-linecap="round"/>`, "#FFF3E0") },

  { key: "shoulder", word: "SHOULDER", label: "shoulder", category: "body",
    colors: ["#EDE7F6", "#B39DDB", "#6A1B9A"],
    art: frame(`<circle cx="100" cy="74" r="24" fill="#FFCC80"/><path d="M54 150 Q64 108 100 108 Q136 108 146 150" fill="#B39DDB"/><path d="M64 152 Q72 122 100 122 Q128 122 136 152" fill="#9575CD"/><path d="M72 112 Q88 96 100 96 Q112 96 128 112" fill="none" stroke="#6A1B9A" stroke-width="5" stroke-linecap="round"/>`, "#EDE7F6") },

  // ── Numbers (10) ──
  { key: "one", word: "ONE", label: "one", category: "numbers", numberValue: 1, art: numberArt(1, "#E0F2F1", "#00796B", "#80CBC4") },
  { key: "two", word: "TWO", label: "two", category: "numbers", numberValue: 2, art: numberArt(2, "#E0F2F1", "#00897B", "#80CBC4") },
  { key: "three", word: "THREE", label: "three", category: "numbers", numberValue: 3, art: numberArt(3, "#E0F2F1", "#009688", "#80CBC4") },
  { key: "four", word: "FOUR", label: "four", category: "numbers", numberValue: 4, art: numberArt(4, "#E0F2F1", "#26A69A", "#A7E1DB") },
  { key: "five", word: "FIVE", label: "five", category: "numbers", numberValue: 5, art: numberArt(5, "#E0F2F1", "#00796B", "#80CBC4") },
  { key: "six", word: "SIX", label: "six", category: "numbers", numberValue: 6, art: numberArt(6, "#E0F2F1", "#00897B", "#80CBC4") },
  { key: "seven", word: "SEVEN", label: "seven", category: "numbers", numberValue: 7, art: numberArt(7, "#E0F2F1", "#009688", "#80CBC4") },
  { key: "eight", word: "EIGHT", label: "eight", category: "numbers", numberValue: 8, art: numberArt(8, "#E0F2F1", "#26A69A", "#A7E1DB") },
  { key: "nine", word: "NINE", label: "nine", category: "numbers", numberValue: 9, art: numberArt(9, "#E0F2F1", "#00796B", "#80CBC4") },
  { key: "ten", word: "TEN", label: "ten", category: "numbers", numberValue: 10, art: numberArt(10, "#E0F2F1", "#00897B", "#80CBC4") },

  // ── Colors (6) ──
  { key: "red", word: "RED", label: "red", category: "colors",
    colors: ["#FFEBEE","#EF5350","#B71C1C"],
    art: frame(`<rect x="40" y="40" width="120" height="120" rx="30" fill="#EF5350"/><circle cx="80" cy="90" r="18" fill="#F44336" opacity="0.6"/><circle cx="120" cy="110" r="14" fill="#E53935" opacity="0.5"/><circle cx="100" cy="70" r="10" fill="#FFCDD2" opacity="0.7"/>`, "#FFEBEE") },

  { key: "blue", word: "BLUE", label: "blue", category: "colors",
    colors: ["#E3F2FD","#42A5F5","#1565C0"],
    art: frame(`<rect x="40" y="40" width="120" height="120" rx="30" fill="#42A5F5"/><circle cx="80" cy="90" r="18" fill="#1E88E5" opacity="0.6"/><circle cx="120" cy="110" r="14" fill="#1565C0" opacity="0.5"/><circle cx="100" cy="70" r="10" fill="#BBDEFB" opacity="0.7"/>`, "#E3F2FD") },

  { key: "green", word: "GREEN", label: "green", category: "colors",
    colors: ["#E8F5E9","#66BB6A","#2E7D32"],
    art: frame(`<rect x="40" y="40" width="120" height="120" rx="30" fill="#66BB6A"/><circle cx="80" cy="90" r="18" fill="#4CAF50" opacity="0.6"/><circle cx="120" cy="110" r="14" fill="#388E3C" opacity="0.5"/><circle cx="100" cy="70" r="10" fill="#C8E6C9" opacity="0.7"/>`, "#E8F5E9") },

  { key: "yellow", word: "YELLOW", label: "yellow", category: "colors",
    colors: ["#FFFDE7","#FFEE58","#F9A825"],
    art: frame(`<rect x="40" y="40" width="120" height="120" rx="30" fill="#FFEE58"/><circle cx="80" cy="90" r="18" fill="#FDD835" opacity="0.6"/><circle cx="120" cy="110" r="14" fill="#F9A825" opacity="0.5"/><circle cx="100" cy="70" r="10" fill="#FFF9C4" opacity="0.7"/>`, "#FFFDE7") },

  { key: "pink", word: "PINK", label: "pink", category: "colors",
    colors: ["#FCE4EC","#F48FB1","#C2185B"],
    art: frame(`<rect x="40" y="40" width="120" height="120" rx="30" fill="#F48FB1"/><circle cx="80" cy="90" r="18" fill="#EC407A" opacity="0.6"/><circle cx="120" cy="110" r="14" fill="#D81B60" opacity="0.5"/><circle cx="100" cy="70" r="10" fill="#F8BBD0" opacity="0.7"/>`, "#FCE4EC") },

  { key: "orange", word: "ORANGE", label: "orange", category: "colors",
    colors: ["#FFF3E0","#FFA726","#E65100"],
    art: frame(`<rect x="40" y="40" width="120" height="120" rx="30" fill="#FFA726"/><circle cx="80" cy="90" r="18" fill="#FB8C00" opacity="0.6"/><circle cx="120" cy="110" r="14" fill="#EF6C00" opacity="0.5"/><circle cx="100" cy="70" r="10" fill="#FFE0B2" opacity="0.7"/>`, "#FFF3E0") },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// === STATE ===

// === ENCOURAGEMENT PHRASES ===

const PHRASES = {
  correct: [
    "Great!", "Awesome!", "Yes!", "Nice one!", "Wow!", "Super!",
    "Amazing!", "You got it!", "Yay!", "Brilliant!", "Fantastic!",
    "Way to go!", "Perfect!", "Excellent!", "Superstar!",
  ],
  complete: [
    "You spelled it!", "Wonderful job!", "You're a star!",
    "So clever!", "You did it!", "Champion speller!",
    "That was perfect!", "Incredible!", "What a genius!",
    "Look at you go!", "Spelling superstar!",
  ],
  streak: [
    "On fire!", "Unstoppable!", "Streak master!",
    "Keep going!", "Amazing streak!", "Nothing stops you!",
  ],
  welcome: [
    "Let's play!", "Ready to spell?", "Hi there!",
    "Let's learn!", "Time to play!",
  ],
  navigate: [
    "Ooh, new word!", "Let's try this one!", "What's this?",
    "I like this one!", "Fun!",
  ],
  patternCorrect: ["You see the pattern!", "Pattern master!", "What comes next? You knew!", "Brilliant!", "You cracked it!", "So smart!"],
  patternComplete: ["All patterns done!", "Pattern genius!", "You see everything!"],
  memoryMatch: ["Great memory!", "You found a pair!", "Match!", "You remembered!", "Sharp eyes!", "Found it!"],
  memoryComplete: ["All pairs found!", "Amazing memory!", "You remembered them all!"],
  sortCorrect: ["Right bucket!", "That goes there!", "Good sorting!", "You know it!", "Sorted!", "Perfect place!"],
  sortComplete: ["All sorted!", "Great organizing!", "Category master!"],
};

function randomPhrase(category) {
  const list = PHRASES[category] || PHRASES.correct;
  return list[Math.floor(Math.random() * list.length)];
}

const state = {
  activeCategory: "all",
  filteredWords: [],
  currentIndex: 0,
  tilePool: [],
  placed: [],
  earnedWords: loadFromStorage("din-english-garden-earned", []),
  speechProvider: "browser",
  activeVoice: null,
  availableVoices: [],
  speechRate: loadFromStorage("din-english-garden-speed", 75) / 100,
  autoAdvance: loadFromStorage("din-english-garden-auto", true),
  useLowercaseText: loadFromStorage("din-english-garden-lowercase", false),
  currentAudio: null,
  currentAudioUrl: null,
  speechAbortController: null,
  spellTimer: null,
  speechSequenceId: 0,
  toastTimer: null,
  celebrationTimer: null,
  completionSpeechTimer: null,
  completionSoundTimer: null,
  autoAdvanceTimer: null,
  welcomeTimer: null,
  navigatePromptTimer: null,
  streakTimer: null,
  streak: 0,
  mascotTimer: null,

  // Game mode
  gameMode: loadFromStorage("din-english-garden-gamemode", "spell"),
  viewMode: "grid",

  // Pattern game state
  pattern: { sequence: [], options: [], correctKey: null, round: 0, level: loadFromStorage("din-english-garden-pattern-level", 1), roundsAtLevel: 0 },

  // Memory game state
  memory: { cards: [], flippedIds: [], matched: 0, moves: 0, lockBoard: false, level: loadFromStorage("din-english-garden-memory-level", 1) },

  // Sort game state
  sort: { currentItem: null, buckets: [], queue: [], correct: 0, total: 0 },
};

// === DOM REFS ===

const el = {};

function cacheElements() {
  const ids = [
    "categories", "settingsBtn", "viewToggle", "caseToggleBtn", "prevBtn", "nextBtn",
    "wordDisplay", "artContainer", "wordTitle", "wordFacts", "hearBtn", "spellBtn", "countBtn",
    "gridView", "wordGrid", "stageView",
    "slots", "tiles", "dots",
    "gameModes", "gameArea", "spellGame", "patternGame", "memoryGame", "sortGame",
    "patternSequence", "patternOptions", "memoryBoard", "sortItem", "sortBuckets",
    "settingsOverlay", "speedSlider", "speedLabel",
    "voiceSelect", "autoAdvance", "autoAdvanceSetting", "resetProgress", "closeSettings",
    "celebrationOverlay", "celebrationStar", "celebrationWord", "celebrationPhrase",
    "mascot", "mascotBubble",
    "toast",
  ];
  ids.forEach((id) => {
    el[id] = document.getElementById(id);
  });
  el.app = document.getElementById("app");
}

// === INIT ===

function init() {
  cacheElements();
  filterWords();
  updateAccentColor();
  updateCaseToggleButton();
  bindEvents();
  initVoice();
  // Set view mode BEFORE rendering so GSAP knows whether to animate
  state.viewMode = loadFromStorage("din-english-garden-view", "grid");
  state.gameMode = loadFromStorage("din-english-garden-gamemode", "spell");
  setCurrentWord(0);
  renderCategories();
  renderGameModes();
  renderDots();
  applyViewMode();
  applyGameMode();
  // Welcome animation
  animateEntrance();
  state.welcomeTimer = setTimeout(() => showMascotBubble(randomPhrase("welcome")), 800);
}

// === EVENTS ===

function bindEvents() {
  el.artContainer.addEventListener("click", () => speakCurrentWord());
  el.hearBtn.addEventListener("click", speakWordOnly);
  el.spellBtn.addEventListener("click", speakCurrentWord);
  el.countBtn.addEventListener("click", speakWordInsight);
  el.prevBtn.addEventListener("click", () => navigate(-1));
  el.nextBtn.addEventListener("click", () => navigate(1));
  el.viewToggle.addEventListener("click", toggleView);
  el.caseToggleBtn.addEventListener("click", toggleTextCase);
  el.settingsBtn.addEventListener("click", openSettings);
  el.closeSettings.addEventListener("click", closeSettings);
  el.resetProgress.addEventListener("click", resetProgress);
  el.celebrationOverlay.addEventListener("click", hideCelebration);

  // Game mode buttons (delegated)
  el.gameModes.addEventListener("click", (e) => {
    const btn = e.target.closest(".game-mode-btn");
    if (!btn) return;
    const key = btn.dataset.mode;
    if (key) selectGameMode(key);
  });

  el.speedSlider.addEventListener("input", () => {
    const val = Number(el.speedSlider.value);
    state.speechRate = val / 100;
    updateSpeedLabel(val);
    saveToStorage("din-english-garden-speed", val);
  });

  el.autoAdvance.addEventListener("change", () => {
    state.autoAdvance = el.autoAdvance.checked;
    saveToStorage("din-english-garden-auto", state.autoAdvance);
    showToast(state.autoAdvance ? "Auto-advance on" : "Auto-advance off", "");
  });

  bindToggleRow(el.autoAdvanceSetting, el.autoAdvance);

  el.voiceSelect.addEventListener("change", () => {
    const id = el.voiceSelect.value;
    state.activeVoice = state.availableVoices.find((v) => v.id === id) || null;
    saveToStorage("din-english-garden-voice", id);
  });

  document.getElementById("previewVoice").addEventListener("click", previewVoice);

  // Swipe support
  let touchStartX = 0;
  el.wordDisplay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  el.wordDisplay.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) navigate(dx < 0 ? 1 : -1);
  }, { passive: true });
}

// === CATEGORIES ===

function renderCategories() {
  el.categories.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-btn" + (state.activeCategory === cat.key ? " active" : "");
    btn.innerHTML = `<span class="cat-icon">${cat.icon}</span><span class="cat-label">${cat.label}</span>`;
    btn.addEventListener("click", () => selectCategory(cat.key));
    el.categories.appendChild(btn);
  });
}

function selectCategory(key) {
  state.activeCategory = key;
  filterWords();
  state.currentIndex = 0;
  updateAccentColor();
  renderCategories();
  setCurrentWord(0);
  renderDots();
  if (state.viewMode === "grid") renderGrid();
  else applyGameMode();
}

function filterWords() {
  state.filteredWords = state.activeCategory === "all"
    ? WORDS
    : WORDS.filter((w) => w.category === state.activeCategory);
}

function updateAccentColor() {
  const cat = CATEGORIES.find((c) => c.key === state.activeCategory) || CATEGORIES[0];
  document.documentElement.style.setProperty("--accent", cat.color);
  document.documentElement.style.setProperty("--accent-bg", cat.bg);
}

// === NAVIGATION ===

function navigate(direction) {
  if (state.gameMode !== "spell") return;
  const len = state.filteredWords.length;
  if (len === 0) return;
  const next = (state.currentIndex + direction + len) % len;
  animateWordTransition(direction);
  setCurrentWord(next);
  speakCurrentWord();
  // Mascot comments on navigation sometimes
  if (Math.random() < 0.3) {
    clearTimeout(state.navigatePromptTimer);
    state.navigatePromptTimer = setTimeout(() => showMascotBubble(randomPhrase("navigate")), 300);
  }
}

function setCurrentWord(index) {
  clearTransientUiState();
  stopSpeech();
  state.currentIndex = index;
  resetPlacements();
  renderWordDisplay();
  renderGame(true);
  renderDots();
}

// === WORD DISPLAY ===

function renderWordDisplay() {
  const entry = currentEntry();
  if (!entry) return;
  el.artContainer.innerHTML = entry.art;
  el.artContainer.classList.add("pulse");
  el.wordTitle.textContent = formatDisplayText(entry.word);
  renderWordFacts(entry);
  animateArtBounce();
  animateTitleReveal();
}

function renderWordFacts(entry = currentEntry()) {
  if (!el.wordFacts || !entry) return;
  const facts = [
    { label: "Letters", value: String(entry.word.length) },
    { label: "Starts", value: formatDisplayText(entry.word[0]) },
  ];

  if (typeof entry.numberValue === "number") {
    facts.push({ label: "Number", value: String(entry.numberValue), tone: "number" });
  } else {
    facts.push({ label: "Ends", value: formatDisplayText(entry.word[entry.word.length - 1]) });
  }

  el.wordFacts.innerHTML = facts.map((fact) => (
    `<span class="fact-chip${fact.tone ? ` ${fact.tone}` : ""}"><strong>${fact.label}</strong><span>${fact.value}</span></span>`
  )).join("");
}

// === GAME ===

function resetPlacements() {
  const entry = currentEntry();
  if (!entry) return;
  state.placed = new Array(entry.word.length).fill(null);
  buildTilePool();
}

function buildTilePool() {
  const entry = currentEntry();
  if (!entry) return;
  const letters = entry.word.split("").map((letter, i) => ({
    id: `${entry.key}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    letter,
    isBonus: false,
  }));
  const distractors = createDistractorTiles(entry);
  state.tilePool = shuffle([...letters, ...distractors]);
}

function createDistractorTiles(entry) {
  const distractorCount = entry.word.length >= 7 ? 2 : entry.word.length >= 5 ? 1 : 0;
  if (distractorCount === 0) return [];

  const taken = new Set(entry.word.split(""));
  const distractors = [];
  while (distractors.length < distractorCount) {
    const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    if (taken.has(letter)) continue;
    taken.add(letter);
    distractors.push({
      id: `${entry.key}-bonus-${distractors.length}-${Math.random().toString(36).slice(2, 7)}`,
      letter,
      isBonus: true,
    });
  }
  return distractors;
}

function renderGame(animate) {
  renderGameStatus();
  renderSlots();
  renderTiles();
  if (animate && state.viewMode !== "grid") {
    animateSlotsEntrance();
    animateTilesEntrance();
  }
  // Setup drag & drop for spell tiles
  if (el.spellGame && state.gameMode === "spell") {
    setupSpellDragDrop();
  }
}

function setupSpellDragDrop() {
  if (!el.spellGame) return;
  const tiles = el.tiles.querySelectorAll(".letter-tile:not(.used)");
  tiles.forEach((tileEl) => {
    let ghost = null;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    tileEl.addEventListener("pointerdown", (e) => {
      if (tileEl.disabled) return;
      isDragging = true;
      const rect = tileEl.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      ghost = tileEl.cloneNode(true);
      ghost.className = "drag-ghost";
      ghost.style.width = rect.width + "px";
      ghost.style.height = rect.height + "px";
      ghost.style.left = (e.clientX - offsetX) + "px";
      ghost.style.top = (e.clientY - offsetY) + "px";
      ghost.style.display = "grid";
      ghost.style.placeItems = "center";
      ghost.style.fontSize = tileEl.style.fontSize || "";
      ghost.style.fontFamily = "Fredoka, sans-serif";
      ghost.style.fontWeight = "700";
      ghost.style.background = "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,248,225,0.75))";
      document.body.appendChild(ghost);

      tileEl.classList.add("dragging");
      tileEl.setPointerCapture(e.pointerId);
    });

    tileEl.addEventListener("pointermove", (e) => {
      if (!isDragging || !ghost) return;
      e.preventDefault();
      ghost.style.left = (e.clientX - offsetX) + "px";
      ghost.style.top = (e.clientY - offsetY) + "px";

      ghost.style.display = "none";
      const below = document.elementFromPoint(e.clientX, e.clientY);
      ghost.style.display = "";

      el.slots.querySelectorAll(".letter-slot").forEach((s) => s.classList.remove("drag-hover"));
      if (below) {
        const slot = below.closest(".letter-slot.active");
        if (slot) slot.classList.add("drag-hover");
      }
    });

    tileEl.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      tileEl.classList.remove("dragging");
      el.slots.querySelectorAll(".letter-slot").forEach((s) => s.classList.remove("drag-hover"));

      if (ghost) ghost.style.display = "none";
      const below = document.elementFromPoint(e.clientX, e.clientY);
      if (ghost) { ghost.remove(); ghost = null; }

      if (below) {
        const slot = below.closest(".letter-slot.active");
        if (slot) {
          // Find the tile in the pool that matches this element
          const letterText = tileEl.textContent;
          const tile = state.tilePool.find((t) =>
            formatDisplayText(t.letter) === letterText && !state.placed.includes(t.id)
          );
          if (tile) handleTileTap(tile);
          return;
        }
      }
    });

    tileEl.addEventListener("pointercancel", () => {
      isDragging = false;
      tileEl.classList.remove("dragging");
      el.slots.querySelectorAll(".letter-slot").forEach((s) => s.classList.remove("drag-hover"));
      if (ghost) { ghost.remove(); ghost = null; }
    });
  });
}

function renderSlots() {
  const entry = currentEntry();
  if (!entry) return;
  el.slots.innerHTML = "";
  const firstEmpty = state.placed.indexOf(null);

  entry.word.split("").forEach((letter, i) => {
    const slot = document.createElement("div");
    slot.className = "letter-slot";

    if (state.placed[i]) {
      const tile = findTile(state.placed[i]);
      slot.classList.add("filled");
      slot.innerHTML = `<span class="slot-letter">${formatDisplayText(tile ? tile.letter : letter)}</span>`;
    } else {
      slot.textContent = formatDisplayText(letter);
      if (i === firstEmpty) {
        slot.classList.add("active");
      }
    }

    el.slots.appendChild(slot);
  });
}

function renderTiles() {
  el.tiles.innerHTML = "";
  state.tilePool.forEach((tile) => {
    const used = state.placed.includes(tile.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "letter-tile" + (used ? " used" : "") + (tile.isBonus ? " bonus" : "");
    btn.textContent = formatDisplayText(tile.letter);
    btn.disabled = used;
    btn.setAttribute("aria-label", tile.isBonus ? `Bonus letter ${formatDisplayText(tile.letter)}` : `Letter ${formatDisplayText(tile.letter)}`);

    if (!used) {
      btn.addEventListener("click", () => handleTileTap(tile));
    }

    el.tiles.appendChild(btn);
  });
}

function renderGameStatus() {
  const entry = currentEntry();
  if (!el.gameStatus || !entry) return;
  const placedCount = state.placed.filter(Boolean).length;
  const distractorCount = state.tilePool.filter((tile) => tile.isBonus).length;
  const challengeText = distractorCount > 0 ? `  •  ${distractorCount} bonus letter${distractorCount > 1 ? "s" : ""}` : "";
  el.gameStatus.textContent = `${placedCount} / ${entry.word.length} letters${challengeText}`;
}

function handleTileTap(tile) {
  const entry = currentEntry();
  if (!entry) return;

  const firstEmpty = state.placed.indexOf(null);
  if (firstEmpty === -1) return;

  const expected = entry.word[firstEmpty];

  if (tile.letter === expected) {
    state.placed[firstEmpty] = tile.id;
    renderGame();
    animateSlotsFill(firstEmpty);
    playCorrectSound();

    // Show encouragement on some correct taps
    if (Math.random() < 0.35) {
      showMascotBubble(randomPhrase("correct"), 1500);
      animateMascotReaction("happy");
    }

    if (state.placed.every(Boolean)) {
      completeWord();
    }
  } else {
    playWrongSound();
    showToast(`Try "${formatDisplayText(expected)}"`, "warning");
    shakeTile(tile.id);
    animateMascotReaction("sad");
    state.streak = 0;
  }
}

function shakeTile(tileId) {
  const btns = el.tiles.querySelectorAll(".letter-tile");
  btns.forEach((btn) => {
    const pool = state.tilePool.find((t) =>
      btn.textContent === formatDisplayText(t.letter) && !state.placed.includes(t.id) && t.id === tileId
    );
    if (pool) {
      btn.classList.add("wrong");
      btn.addEventListener("animationend", () => btn.classList.remove("wrong"), { once: true });
    }
  });
}

function completeWord() {
  const entry = currentEntry();
  if (!entry) return;

  state.streak++;

  if (!state.earnedWords.includes(entry.key)) {
    state.earnedWords.push(entry.key);
    saveToStorage("din-english-garden-earned", state.earnedWords);
  }

  renderDots();
  showCelebration(entry);
  playSuccessChime();

  // Streak bonus
  if (state.streak >= 3) {
    clearTimeout(state.streakTimer);
    state.streakTimer = setTimeout(() => animateStreakBadge(state.streak), 600);
    if (state.streak >= 5) {
      showMascotBubble(randomPhrase("streak"), 3000);
      animateMascotReaction("excited");
    }
  }

  const phrases = [
    `Great job! You spelled ${entry.label}!`,
    `Amazing! ${entry.label}!`,
    `Wow, ${entry.label}! You're so smart!`,
    `${entry.label}! That's perfect!`,
    `You nailed ${entry.label}!`,
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];

  clearTimeout(state.completionSpeechTimer);
  clearTimeout(state.completionSoundTimer);
  state.completionSpeechTimer = setTimeout(() => {
    speakText(phrase, { rate: state.speechRate });
    if (entry.sound) {
      state.completionSoundTimer = setTimeout(() => speakText(entry.sound, { rate: 1 }), 1400);
    }
  }, 400);
}

// === CELEBRATION ===

function showCelebration(entry) {
  hideCelebration();
  el.celebrationPhrase.textContent = randomPhrase("complete");
  el.celebrationPhrase.style.opacity = "1";
  el.celebrationWord.textContent = formatDisplayText(entry.word);
  el.celebrationOverlay.hidden = false;
  spawnConfetti();
  animateCelebration();

  state.celebrationTimer = setTimeout(() => {
    if (typeof gsap !== "undefined") {
      gsap.to(el.celebrationOverlay, {
        opacity: 0, duration: 0.3, onComplete: () => {
          hideCelebration();
          if (state.autoAdvance) {
            clearTimeout(state.autoAdvanceTimer);
            state.autoAdvanceTimer = setTimeout(() => navigate(1), 300);
          }
        }
      });
    } else {
      hideCelebration();
      if (state.autoAdvance) {
        clearTimeout(state.autoAdvanceTimer);
        state.autoAdvanceTimer = setTimeout(() => navigate(1), 300);
      }
    }
  }, 3200);

}

function hideCelebration() {
  clearTimeout(state.celebrationTimer);
  clearTimeout(state.autoAdvanceTimer);
  state.celebrationTimer = null;
  state.autoAdvanceTimer = null;
  if (!el.celebrationOverlay) return;
  el.celebrationOverlay.hidden = true;
  el.celebrationOverlay.style.opacity = "1";
  if (typeof gsap !== "undefined") {
    gsap.killTweensOf(el.celebrationOverlay);
    gsap.set(el.celebrationOverlay, { opacity: 1 });
  }
  clearConfetti();
}

function spawnConfetti() {
  clearConfetti();
  const colors = ["#FF8A65", "#FFB74D", "#66BB6A", "#42A5F5", "#AB47BC", "#FFD54F", "#EF5350"];
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${-10 - Math.random() * 20}px`;
    piece.style.width = `${8 + Math.random() * 8}px`;
    piece.style.height = piece.style.width;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--fall-duration", `${1.5 + Math.random() * 1.5}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * 0.6}s`);
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
    document.body.appendChild(piece);
  }
}

function clearConfetti() {
  document.querySelectorAll(".confetti-piece").forEach((p) => p.remove());
}

// === DOTS NAV ===

function renderDots() {
  el.dots.innerHTML = "";
  const words = state.filteredWords;

  // If more than 15 words, show a counter instead of dots
  if (words.length > 15) {
    const counter = document.createElement("span");
    counter.className = "word-counter";
    const earned = words.filter((w) => state.earnedWords.includes(w.key)).length;
    counter.textContent = `${state.currentIndex + 1} / ${words.length}  \u2022  ${earned} \u2B50`;
    el.dots.appendChild(counter);
    return;
  }

  words.forEach((entry, i) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (i === state.currentIndex) dot.classList.add("current");
    if (state.earnedWords.includes(entry.key)) dot.classList.add("earned");
    dot.addEventListener("click", () => {
      setCurrentWord(i);
      speakCurrentWord();
    });
    el.dots.appendChild(dot);
  });
}

// === VIEW TOGGLE ===

function toggleView() {
  state.viewMode = state.viewMode === "grid" ? "card" : "grid";
  saveToStorage("din-english-garden-view", state.viewMode);
  if (state.viewMode === "grid") {
    // Clean up any active game state when entering grid
    el.app.classList.remove("fullscreen-game");
  }
  applyViewMode(true);
}

function applyViewMode(fromToggle) {
  if (state.viewMode === "grid") {
    el.app.classList.add("grid-mode");
    renderGrid();
  } else {
    el.app.classList.remove("grid-mode");
    if (fromToggle) {
      applyGameMode();
      animateArtBounce();
      animateTitleReveal();
    }
  }
}

function renderGrid() {
  el.wordGrid.innerHTML = "";
  state.filteredWords.forEach((entry, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "grid-card" + (state.earnedWords.includes(entry.key) ? " earned" : "");

    const star = state.earnedWords.includes(entry.key) ? `<span class="grid-star">\u2B50</span>` : "";
    const tag = entry.numberValue
      ? `<span class="grid-tag">#${entry.numberValue}</span>`
      : entry.word.length >= 6
        ? `<span class="grid-tag">${entry.word.length} letters</span>`
        : "";
    card.innerHTML = `${star}<div class="grid-art">${entry.art}</div><span class="grid-word">${formatDisplayText(entry.word)}</span>${tag}`;

    card.addEventListener("click", () => {
      setCurrentWord(i);
      speakCurrentWord();
      playTone(660, 0.06, 0.06);
    });

    // Double-tap to enter game mode
    let lastTap = 0;
    card.addEventListener("pointerup", () => {
      const now = Date.now();
      if (now - lastTap < 400) {
        state.viewMode = "card";
        saveToStorage("din-english-garden-view", "card");
        applyViewMode(true);
      }
      lastTap = now;
    });

    el.wordGrid.appendChild(card);
  });
  animateGridCards();
}

function switchToCardView(index) {
  state.viewMode = "card";
  saveToStorage("din-english-garden-view", "card");
  setCurrentWord(index);
  applyViewMode(true);
  speakCurrentWord();
}

// === SPEECH ===

async function initVoice() {
  try {
    await initServerVoices();
  } catch (_) {
    // fall through to browser
  }
  if (!state.activeVoice) initBrowserVoices();
  renderVoiceOptions();
}

async function initServerVoices() {
  const res = await fetch("/api/voices");
  if (!res.ok) throw new Error("unavailable");
  const data = await res.json();
  if (!data.configured || !data.voices?.length) throw new Error("not configured");

  const stored = loadFromStorage("din-english-garden-voice", null);
  const preferredStored = stored && stored.startsWith("azure:") ? stored : null;
  state.availableVoices = data.voices.map((v) => ({
    id: v.shortName, name: v.displayName, locale: v.locale, provider: v.provider || "server",
  }));
  state.activeVoice =
    state.availableVoices.find((v) => v.id === preferredStored) ||
    state.availableVoices.find((v) => v.id === data.defaultVoice) ||
    state.availableVoices[0] || null;
  state.speechProvider = "server";
}

function initBrowserVoices() {
  const update = () => {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const en = voices.filter((v) => v.lang?.startsWith("en")).map((v) => ({
      id: v.voiceURI || v.name, name: v.name, locale: v.lang, provider: "browser", raw: v,
    }));
    state.availableVoices = en;
    const stored = loadFromStorage("din-english-garden-voice", null);
    state.activeVoice =
      en.find((v) => v.id === stored) ||
      en.find((v) => v.locale === "en-US") ||
      en[0] || null;
    renderVoiceOptions();
  };
  update();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = update;
}

function renderVoiceOptions() {
  if (!el.voiceSelect) return;
  el.voiceSelect.innerHTML = "";
  if (state.availableVoices.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "No voice found";
    el.voiceSelect.appendChild(opt);
    el.voiceSelect.disabled = true;
    return;
  }
  el.voiceSelect.disabled = false;
  state.availableVoices.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.id;
    const providerLabel = v.provider === "elevenlabs" ? "11Labs" : v.provider === "azure" ? "Azure" : "Device";
    opt.textContent = `${v.name} · ${providerLabel}`;
    if (state.activeVoice?.id === v.id) opt.selected = true;
    el.voiceSelect.appendChild(opt);
  });
}

async function speakCurrentWord() {
  const entry = currentEntry();
  if (!entry) return;
  const sequenceId = startSpeechSequence();
  await speakText(entry.label, { rate: getTeachingWordRate(), preserveSequence: true });
  if (!isSpeechSequenceActive(sequenceId)) return;
  await wait(900);
  if (!isSpeechSequenceActive(sequenceId)) return;
  await spellWord(entry.word, sequenceId);
}

async function speakWordOnly() {
  const entry = currentEntry();
  if (!entry) return;
  const sequenceId = startSpeechSequence();
  await speakText(entry.label, { rate: getTeachingWordRate(), preserveSequence: true });
  return sequenceId;
}

async function speakWordInsight() {
  const entry = currentEntry();
  if (!entry) return;

  const parts = [entry.label];
  if (typeof entry.numberValue === "number") {
    parts.push(`Number ${entry.numberValue}.`);
  }
  parts.push(`${entry.word.length} letters.`);
  parts.push(`Starts with ${entry.word[0].toLowerCase()}.`);

  const sequenceId = startSpeechSequence();
  await speakText(parts.join(" "), { rate: getTeachingWordRate(), preserveSequence: true });
  if (!isSpeechSequenceActive(sequenceId)) return;
  await wait(500);
  if (!isSpeechSequenceActive(sequenceId)) return;
  await spellWord(entry.word, sequenceId);
}

async function spellWord(word, sequenceId = state.speechSequenceId) {
  const letters = word.toLowerCase().split("");
  for (let i = 0; i < letters.length; i++) {
    if (!isSpeechSequenceActive(sequenceId)) return;
    await speakText(letters[i], {
      rate: getTeachingLetterRate(),
      pitch: 1,
      preserveSequence: true,
    });
    if (i < letters.length - 1) {
      await wait(700);
    }
  }
}

async function previewVoice() {
  const sequenceId = startSpeechSequence();
  await speakText("Hello. This is my voice.", { rate: getTeachingWordRate(), preserveSequence: true });
  if (!isSpeechSequenceActive(sequenceId)) return;
  await wait(500);
  if (!isSpeechSequenceActive(sequenceId)) return;
  await speakText("Dog", { rate: getTeachingWordRate(), preserveSequence: true });
  if (!isSpeechSequenceActive(sequenceId)) return;
  await wait(900);
  if (!isSpeechSequenceActive(sequenceId)) return;
  await spellWord("DOG", sequenceId);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function speakText(text, opts = {}) {
  if (!opts.preserveSequence) {
    startSpeechSequence();
  }
  if (state.speechProvider === "server" && state.activeVoice) {
    try { await serverSpeak(text, opts); return; } catch (e) {
      if (e?.name === "AbortError") return;
      state.speechProvider = "browser";
      initBrowserVoices();
    }
  }
  await browserSpeak(text, opts);
}

async function serverSpeak(text, opts) {
  state.speechAbortController = new AbortController();
  const ctrl = state.speechAbortController;
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: ctrl.signal,
    body: JSON.stringify({
      text,
      voice: state.activeVoice.id,
      rate: opts.rate || state.speechRate,
      pitch: opts.pitch || 1,
      spelling: Boolean(opts.spelling),
    }),
  });
  if (!res.ok) throw new Error("TTS failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  state.currentAudio = audio;
  state.currentAudioUrl = url;

  await new Promise((resolve, reject) => {
    audio.onended = () => { cleanupCurrentAudioUrl(url); state.currentAudio = null; resolve(); };
    audio.onerror = () => { cleanupCurrentAudioUrl(url); state.currentAudio = null; reject(new Error("playback")); };
    audio.play().catch((e) => { cleanupCurrentAudioUrl(url); state.currentAudio = null; reject(e); });
  });
  if (state.speechAbortController === ctrl) state.speechAbortController = null;
}

function browserSpeak(text, opts) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = state.activeVoice?.raw || null;
    u.lang = state.activeVoice?.locale || "en-US";
    u.rate = opts.rate || state.speechRate;
    u.pitch = opts.pitch || 1.05;
    u.volume = 1;
    u.onend = resolve;
    u.onerror = resolve;
    speechSynthesis.speak(u);
  });
}

function stopSpeech() {
  clearTimeout(state.spellTimer);
  clearTimeout(state.completionSpeechTimer);
  clearTimeout(state.completionSoundTimer);
  state.speechSequenceId += 1;
  if (state.speechAbortController) { state.speechAbortController.abort(); state.speechAbortController = null; }
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  cleanupCurrentAudioUrl();
  if (window.speechSynthesis) speechSynthesis.cancel();
}

function startSpeechSequence() {
  stopSpeech();
  return state.speechSequenceId;
}

function isSpeechSequenceActive(sequenceId) {
  return sequenceId === state.speechSequenceId;
}

function getTeachingWordRate() {
  return clampValue(state.speechRate * 0.82, 0.58, 0.92);
}

function getTeachingLetterRate() {
  return clampValue(state.speechRate * 0.9, 0.6, 1);
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// === SOUND EFFECTS ===

let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, dur = 0.12, vol = 0.08) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (_) { /* silent fail */ }
}

function playCorrectSound() { playTone(880, 0.15, 0.08); }
function playWrongSound() { playTone(220, 0.18, 0.05); }
function playSuccessChime() {
  playTone(523, 0.22, 0.10);
  setTimeout(() => playTone(659, 0.22, 0.10), 160);
  setTimeout(() => playTone(784, 0.35, 0.10), 320);
}

// === SETTINGS ===

function openSettings() {
  el.settingsOverlay.hidden = false;
  el.speedSlider.value = Math.round(state.speechRate * 100);
  updateSpeedLabel(Math.round(state.speechRate * 100));
  el.autoAdvance.checked = state.autoAdvance;
}

function closeSettings() {
  el.settingsOverlay.hidden = true;
}

function resetProgress() {
  state.earnedWords = [];
  saveToStorage("din-english-garden-earned", []);
  state.pattern.level = 1;
  state.pattern.roundsAtLevel = 0;
  saveToStorage("din-english-garden-pattern-level", 1);
  state.memory.level = 1;
  saveToStorage("din-english-garden-memory-level", 1);
  state.sort.correct = 0;
  state.sort.total = 0;
  renderDots();
  if (state.viewMode === "grid") renderGrid();
  showToast("Progress reset", "");
  closeSettings();
}

function updateSpeedLabel(val) {
  let label;
  if (val <= 55) label = "Very slow";
  else if (val <= 65) label = "Slow";
  else if (val <= 80) label = "Default";
  else if (val <= 95) label = "Medium";
  else if (val <= 105) label = "Normal";
  else label = "Fast";
  el.speedLabel.textContent = label;
}

// === TOAST ===

function showToast(message, tone) {
  el.toast.textContent = message;
  el.toast.className = "toast visible" + (tone ? ` ${tone}` : "");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    el.toast.classList.remove("visible");
  }, 1800);
}

// === UTILITIES ===

function currentEntry() {
  return state.filteredWords[state.currentIndex] || null;
}

function formatDisplayText(text) {
  if (typeof text !== "string") return text;
  return state.useLowercaseText ? text.toLowerCase() : text.toUpperCase();
}

function refreshTextCase() {
  updateCaseToggleButton();
  renderWordDisplay();
  renderGame(false);
  renderDots();
  if (state.viewMode === "grid") {
    renderGrid();
  }
  const entry = currentEntry();
  if (entry && !el.celebrationOverlay.hidden) {
    el.celebrationWord.textContent = formatDisplayText(entry.word);
  }
}

function toggleTextCase() {
  state.useLowercaseText = !state.useLowercaseText;
  saveToStorage("din-english-garden-lowercase", state.useLowercaseText);
  refreshTextCase();
  showToast(state.useLowercaseText ? "Lowercase letters on" : "Capital letters on", "");
}

function updateCaseToggleButton() {
  if (!el.caseToggleBtn) return;
  const label = el.caseToggleBtn.querySelector(".case-toggle-label");
  const useLowercase = state.useLowercaseText;
  el.caseToggleBtn.classList.toggle("active", useLowercase);
  el.caseToggleBtn.setAttribute("aria-pressed", String(useLowercase));
  el.caseToggleBtn.setAttribute("aria-label", useLowercase ? "Use capital letters" : "Use lowercase letters");
  if (label) {
    label.textContent = useLowercase ? "abc" : "ABC";
  }
}

function bindToggleRow(row, input) {
  if (!row || !input) return;
  row.style.cursor = "pointer";
  row.addEventListener("click", (event) => {
    event.preventDefault();
    input.checked = !input.checked;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function findTile(id) {
  return state.tilePool.find((t) => t.id === id) || null;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadFromStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch (_) { return fallback; }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* silent */ }
}

function clearTransientUiState() {
  clearTimeout(state.navigatePromptTimer);
  clearTimeout(state.welcomeTimer);
  clearTimeout(state.streakTimer);
  state.navigatePromptTimer = null;
  state.welcomeTimer = null;
  state.streakTimer = null;
  hideCelebration();
}

function cleanupCurrentAudioUrl(url = state.currentAudioUrl) {
  if (!url) return;
  URL.revokeObjectURL(url);
  if (state.currentAudioUrl === url) {
    state.currentAudioUrl = null;
  }
}

// === GSAP ANIMATIONS ===

function animateEntrance() {
  if (typeof gsap === "undefined") return;
  gsap.from(".top-bar", { y: -40, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
  gsap.from(".bottom-bar", { y: 30, opacity: 0, duration: 0.4, ease: "power2.out", delay: 0.15 });
  gsap.from(".mascot-body", { scale: 0, rotation: -180, duration: 0.6, ease: "back.out(2)", delay: 0.4 });
}

function animateWordTransition(direction) {
  if (typeof gsap === "undefined") return;
  const tl = gsap.timeline();
  const xOut = direction > 0 ? -60 : 60;
  const xIn = direction > 0 ? 60 : -60;

  tl.to(el.wordDisplay, { x: xOut, opacity: 0, scale: 0.9, duration: 0.2, ease: "power2.in" })
    .set(el.wordDisplay, { x: xIn })
    .to(el.wordDisplay, { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)" });
}

function animateArtBounce() {
  el.artContainer.classList.remove("animate-in");
  void el.artContainer.offsetWidth;
  el.artContainer.classList.add("animate-in");
}

function animateTitleReveal() {
  el.wordTitle.classList.remove("animate-in");
  void el.wordTitle.offsetWidth;
  el.wordTitle.classList.add("animate-in");
}

function animateSlotsFill(slotIndex) {
  const slots = el.slots.querySelectorAll(".letter-slot");
  const slot = slots[slotIndex];
  if (!slot) return;
  slot.classList.remove("animate-in");
  slot.style.animation = "none";
  void slot.offsetWidth;
  slot.style.animation = "letterPop 250ms var(--ease-bounce)";
}

function animateTilesEntrance() {
  const tiles = el.tiles.querySelectorAll(".letter-tile");
  tiles.forEach((tile, i) => {
    tile.classList.remove("animate-in");
    void tile.offsetWidth;
    tile.style.animationDelay = `${i * 0.05}s`;
    tile.classList.add("animate-in");
  });
}

function animateSlotsEntrance() {
  const slots = el.slots.querySelectorAll(".letter-slot");
  slots.forEach((slot, i) => {
    slot.classList.remove("animate-in");
    void slot.offsetWidth;
    slot.style.animationDelay = `${i * 0.05}s`;
    slot.classList.add("animate-in");
  });
}

function animateCelebration() {
  if (typeof gsap === "undefined") return;
  const tl = gsap.timeline();
  const octopus = document.querySelector(".celebration-octopus");
  const robot = document.querySelector(".celebration-robot");

  tl.from(octopus, { x: -80, opacity: 0, rotation: -20, duration: 0.5, ease: "back.out(1.7)" })
    .from(robot, { x: 80, opacity: 0, rotation: 20, duration: 0.5, ease: "back.out(1.7)" }, "-=0.35")
    .from(el.celebrationStar, { scale: 0, rotation: -360, duration: 0.6, ease: "back.out(2)" }, "-=0.3")
    .from(el.celebrationPhrase, { y: 30, opacity: 0, duration: 0.35, ease: "power2.out" }, "-=0.2")
    .from(el.celebrationWord, { scale: 0.5, opacity: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" }, "-=0.15");

  // Mascots bounce happily
  gsap.to(octopus, { y: -6, duration: 0.3, ease: "power1.inOut", yoyo: true, repeat: 4, delay: 0.8 });
  gsap.to(robot, { y: -6, duration: 0.3, ease: "power1.inOut", yoyo: true, repeat: 4, delay: 1 });
}

function animateGridCards() {
  const cards = el.wordGrid.querySelectorAll(".grid-card");
  cards.forEach((card, i) => {
    card.classList.remove("animate-in");
    void card.offsetWidth;
    card.style.animationDelay = `${i * 20}ms`;
    card.classList.add("animate-in");
  });
}

function animateMascotReaction(type) {
  if (typeof gsap === "undefined") return;
  const body = el.mascot?.querySelector(".mascot-body");
  if (!body) return;

  if (type === "happy") {
    gsap.to(body, { y: -8, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 2 });
  } else if (type === "excited") {
    gsap.to(body, { rotation: 15, duration: 0.1, ease: "power1.inOut", yoyo: true, repeat: 5 });
  } else if (type === "sad") {
    gsap.to(body, { x: -4, duration: 0.08, ease: "power1.inOut", yoyo: true, repeat: 3 });
  }
}

function animateStreakBadge(count) {
  if (typeof gsap === "undefined") return;
  let badge = document.querySelector(".streak-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "streak-badge";
    document.getElementById("app").appendChild(badge);
  }
  badge.textContent = `${count} in a row!`;
  gsap.fromTo(badge,
    { opacity: 0, scale: 0, rotation: -10 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" }
  );
  gsap.to(badge, { opacity: 0, scale: 0.8, delay: 2, duration: 0.3 });
}

// === MASCOT ===

function showMascotBubble(text, duration) {
  if (!el.mascotBubble) return;
  clearTimeout(state.mascotTimer);
  el.mascotBubble.textContent = text;
  if (typeof gsap !== "undefined") {
    gsap.to(el.mascotBubble, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" });
    state.mascotTimer = setTimeout(() => {
      gsap.to(el.mascotBubble, { opacity: 0, scale: 0.8, y: 8, duration: 0.2 });
    }, duration || 2500);
  } else {
    el.mascotBubble.style.opacity = "1";
    el.mascotBubble.style.transform = "scale(1) translateY(0)";
    state.mascotTimer = setTimeout(() => {
      el.mascotBubble.style.opacity = "0";
    }, duration || 2500);
  }
}

// === GAME MODES ===

function renderGameModes() {
  if (!el.gameModes) return;
  el.gameModes.innerHTML = "";
  GAME_MODES.forEach((mode) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "game-mode-btn" + (state.gameMode === mode.key ? " active" : "");
    btn.dataset.mode = mode.key;
    btn.innerHTML = `<span class="gm-icon">${mode.icon}</span><span>${mode.label}</span>`;
    el.gameModes.appendChild(btn);
  });
}

function selectGameMode(key) {
  state.gameMode = key;
  saveToStorage("din-english-garden-gamemode", key);
  renderGameModes();
  applyGameMode();
}

function applyGameMode() {
  if (!el.gameArea) return;
  // Hide all game panels
  const panels = el.gameArea.querySelectorAll(".game-panel");
  panels.forEach((p) => { p.hidden = true; });

  // Show the matching panel
  const activePanel = el.gameArea.querySelector(`[data-game="${state.gameMode}"]`);
  if (activePanel) activePanel.hidden = false;

  // Fullscreen for memory
  if (state.gameMode === "memory") {
    el.app.classList.add("fullscreen-game");
  } else {
    el.app.classList.remove("fullscreen-game");
  }

  // Init the appropriate game
  switch (state.gameMode) {
    case "spell":
      renderGame(true);
      break;
    case "pattern":
      initPatternRound();
      break;
    case "memory":
      initMemoryGame();
      break;
    case "sort":
      initSortGame();
      break;
  }
}

// === PATTERN MATCH GAME ===

function getPatternType(level) {
  // Level 1: AB, Level 2: AB (longer), Level 3: ABC, Level 4: AAB/ABB, Level 5: AABB
  switch (level) {
    case 1: return "AB";
    case 2: return "AB_LONG";
    case 3: return "ABC";
    case 4: return "AAB";
    case 5: default: return "AABB";
  }
}

function initPatternRound() {
  const words = state.filteredWords.length >= 3 ? state.filteredWords : WORDS;
  const patternType = getPatternType(state.pattern.level);

  // Pick 2-3 random words depending on pattern type
  const needCount = patternType === "ABC" ? 3 : 2;
  const picked = shuffle(words).slice(0, Math.max(needCount, 3));
  const bases = picked.slice(0, needCount);

  let pattern = [];
  switch (patternType) {
    case "AB":
      pattern = [0, 1, 0, 1, 0, null]; // A B A B A ?
      break;
    case "AB_LONG":
      pattern = [0, 1, 0, 1, 0, 1, 0, null];
      break;
    case "ABC":
      pattern = [0, 1, 2, 0, 1, null];
      break;
    case "AAB":
      pattern = [0, 0, 1, 0, 0, null];
      break;
    case "AABB":
      pattern = [0, 0, 1, 1, 0, 0, null];
      break;
    default:
      pattern = [0, 1, 0, 1, 0, null];
  }

  // Build the sequence
  const sequence = pattern.map((idx) => {
    if (idx === null) return null;
    return bases[idx].key;
  });

  // Determine correct answer - figure out what should replace null
  const nullIdx = pattern.indexOf(null);
  const correctPatternIdx = pattern[nullIdx % (pattern.indexOf(null))]; // repeat the pattern
  // Actually, let's compute it properly: find the period
  const nonNullPattern = pattern.filter((x) => x !== null);
  // Detect the cycle length
  let cycleLen = 1;
  outer: for (let cl = 1; cl <= nonNullPattern.length; cl++) {
    for (let i = 0; i < nonNullPattern.length; i++) {
      if (nonNullPattern[i] !== nonNullPattern[i % cl]) continue outer;
    }
    cycleLen = cl;
    break;
  }
  const correctIdx = nonNullPattern[nonNullPattern.length % cycleLen];
  const correctKey = bases[correctIdx].key;

  // Build options: correct + 2 random distractors
  const distractorPool = shuffle(words.filter((w) => w.key !== correctKey));
  const distractors = distractorPool.slice(0, 2).map((w) => w.key);
  const options = shuffle([correctKey, ...distractors]);

  state.pattern.sequence = sequence;
  state.pattern.options = options;
  state.pattern.correctKey = correctKey;

  renderPatternGame();
}

function renderPatternGame() {
  if (!el.patternSequence || !el.patternOptions) return;

  // Round counter
  const roundLabel = `Round ${state.pattern.round + 1}`;

  // Render sequence
  el.patternSequence.innerHTML = "";
  state.pattern.sequence.forEach((wordKey, i) => {
    const div = document.createElement("div");
    if (wordKey === null) {
      div.className = "pattern-item mystery";
      div.textContent = "?";
      div.dataset.index = i;
    } else {
      const entry = WORDS.find((w) => w.key === wordKey);
      div.className = "pattern-item";
      if (entry) div.innerHTML = entry.art;
    }
    el.patternSequence.appendChild(div);
  });

  // Add round counter
  const counter = document.createElement("div");
  counter.style.cssText = "width:100%;text-align:center;font-family:Fredoka,sans-serif;font-size:0.8rem;font-weight:700;color:var(--text-faint);margin-top:4px;";
  counter.textContent = `${roundLabel}  \u2022  Level ${state.pattern.level}`;
  el.patternSequence.appendChild(counter);

  // Render options
  el.patternOptions.innerHTML = "";
  state.pattern.options.forEach((wordKey) => {
    const entry = WORDS.find((w) => w.key === wordKey);
    if (!entry) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pattern-option";
    btn.innerHTML = entry.art;
    btn.addEventListener("click", () => handlePatternChoice(wordKey));
    el.patternOptions.appendChild(btn);
  });
}

function handlePatternChoice(wordKey) {
  if (wordKey === state.pattern.correctKey) {
    // Correct! Animate the answer into place
    const mystery = el.patternSequence.querySelector(".mystery");
    if (mystery) {
      const entry = WORDS.find((w) => w.key === wordKey);
      if (entry) {
        mystery.classList.remove("mystery");
        mystery.innerHTML = entry.art;
        mystery.style.animation = "letterPop 250ms var(--ease-bounce)";
      }
    }

    // Highlight correct option
    const opts = el.patternOptions.querySelectorAll(".pattern-option");
    opts.forEach((opt) => {
      const optEntry = WORDS.find((w) => opt.innerHTML.includes(w.key));
      opt.style.pointerEvents = "none";
    });
    const correctOpt = [...opts].find((o) => {
      const entry = WORDS.find((w) => w.key === wordKey);
      return entry && o.innerHTML === entry.art;
    });
    if (correctOpt) correctOpt.classList.add("correct");

    playCorrectSound();
    showMascotBubble(randomPhrase("patternCorrect"), 1500);
    animateMascotReaction("happy");

    // Speak the word
    const entry = WORDS.find((w) => w.key === wordKey);
    if (entry) speakText(entry.label, { rate: getTeachingWordRate() });

    state.pattern.round++;
    state.pattern.roundsAtLevel++;

    // Check for level advance
    if (state.pattern.round >= 5) {
      // Celebration
      setTimeout(() => {
        if (entry) showCelebration(entry);
        playSuccessChime();
        showMascotBubble(randomPhrase("patternComplete"), 3000);

        // Advance level after 3 completions at current level
        if (state.pattern.roundsAtLevel >= 3 && state.pattern.level < 5) {
          state.pattern.level++;
          state.pattern.roundsAtLevel = 0;
          saveToStorage("din-english-garden-pattern-level", state.pattern.level);
          showToast(`Level ${state.pattern.level} unlocked!`, "success");
        }

        state.pattern.round = 0;
        setTimeout(() => initPatternRound(), 3500);
      }, 800);
    } else {
      setTimeout(() => initPatternRound(), 1200);
    }
  } else {
    // Wrong
    playWrongSound();
    const opts = el.patternOptions.querySelectorAll(".pattern-option");
    opts.forEach((opt) => {
      const entry = WORDS.find((w) => w.key === wordKey);
      if (entry && opt.innerHTML === entry.art) {
        opt.classList.add("wrong");
        opt.addEventListener("animationend", () => opt.classList.remove("wrong"), { once: true });
      }
    });
    animateMascotReaction("sad");
  }
}

// === MEMORY PAIRS GAME ===

function initMemoryGame() {
  const words = state.filteredWords.length >= 6 ? state.filteredWords : WORDS;
  const level = state.memory.level;

  // Pairs based on level
  let pairCount;
  if (level <= 1) pairCount = 3;      // 6 cards
  else if (level <= 2) pairCount = 4;  // 8 cards
  else pairCount = 6;                  // 12 cards

  const picked = shuffle(words).slice(0, pairCount);
  let cardId = 0;
  const cards = [];

  picked.forEach((entry) => {
    cards.push({ id: cardId++, wordKey: entry.key, type: "picture", flipped: false, matched: false });
    cards.push({ id: cardId++, wordKey: entry.key, type: "word", flipped: false, matched: false });
  });

  state.memory.cards = shuffle(cards);
  state.memory.flippedIds = [];
  state.memory.matched = 0;
  state.memory.moves = 0;
  state.memory.lockBoard = false;

  renderMemoryBoard();
}

function renderMemoryBoard() {
  if (!el.memoryBoard) return;
  el.memoryBoard.innerHTML = "";

  const totalCards = state.memory.cards.length;
  // Grid columns
  el.memoryBoard.className = "memory-board";
  if (totalCards <= 6) el.memoryBoard.classList.add("cols-3");
  else el.memoryBoard.classList.add("cols-4");

  state.memory.cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "memory-card";
    if (card.flipped) cardEl.classList.add("flipped");
    if (card.matched) cardEl.classList.add("matched");
    cardEl.dataset.cardId = card.id;

    const entry = WORDS.find((w) => w.key === card.wordKey);

    let backContent = "";
    if (card.type === "picture" && entry) {
      backContent = entry.art;
    } else if (card.type === "word" && entry) {
      backContent = `<span class="memory-word">${formatDisplayText(entry.word)}</span>`;
    }

    cardEl.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-front">\u2B50</div>
        <div class="memory-card-back">${backContent}</div>
      </div>
    `;

    cardEl.addEventListener("click", () => handleCardFlip(card.id));
    el.memoryBoard.appendChild(cardEl);
  });
}

function handleCardFlip(cardId) {
  if (state.memory.lockBoard) return;

  const card = state.memory.cards.find((c) => c.id === cardId);
  if (!card || card.flipped || card.matched) return;

  // Flip the card
  card.flipped = true;
  state.memory.flippedIds.push(cardId);

  // Update DOM
  const cardEl = el.memoryBoard.querySelector(`[data-card-id="${cardId}"]`);
  if (cardEl) cardEl.classList.add("flipped");

  playTone(660, 0.06, 0.06);

  // Check for match when 2 cards are flipped
  if (state.memory.flippedIds.length === 2) {
    state.memory.moves++;
    state.memory.lockBoard = true;

    const [id1, id2] = state.memory.flippedIds;
    const card1 = state.memory.cards.find((c) => c.id === id1);
    const card2 = state.memory.cards.find((c) => c.id === id2);

    if (card1.wordKey === card2.wordKey) {
      // Match!
      card1.matched = true;
      card2.matched = true;
      state.memory.matched++;

      setTimeout(() => {
        const el1 = el.memoryBoard.querySelector(`[data-card-id="${id1}"]`);
        const el2 = el.memoryBoard.querySelector(`[data-card-id="${id2}"]`);
        if (el1) el1.classList.add("matched");
        if (el2) el2.classList.add("matched");

        playCorrectSound();
        showMascotBubble(randomPhrase("memoryMatch"), 1500);
        animateMascotReaction("happy");

        // Speak the word
        const entry = WORDS.find((w) => w.key === card1.wordKey);
        if (entry) speakText(entry.label, { rate: getTeachingWordRate() });

        state.memory.flippedIds = [];
        state.memory.lockBoard = false;

        // Check for completion
        const totalPairs = state.memory.cards.length / 2;
        if (state.memory.matched >= totalPairs) {
          setTimeout(() => {
            if (entry) showCelebration(entry);
            playSuccessChime();
            showMascotBubble(randomPhrase("memoryComplete"), 3000);

            // Advance level
            if (state.memory.level < 3) {
              state.memory.level++;
              saveToStorage("din-english-garden-memory-level", state.memory.level);
              showToast(`Memory Level ${state.memory.level} unlocked!`, "success");
            }

            setTimeout(() => initMemoryGame(), 3500);
          }, 600);
        }
      }, 400);
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        const el1 = el.memoryBoard.querySelector(`[data-card-id="${id1}"]`);
        const el2 = el.memoryBoard.querySelector(`[data-card-id="${id2}"]`);
        if (el1) el1.classList.remove("flipped");
        if (el2) el2.classList.remove("flipped");

        state.memory.flippedIds = [];
        state.memory.lockBoard = false;
      }, 1000);
    }
  }
}

// === CATEGORY SORT GAME ===

function initSortGame() {
  const words = state.filteredWords.length >= 6 ? state.filteredWords : WORDS;

  // Determine available categories from the words
  const catMap = {};
  words.forEach((w) => {
    if (!catMap[w.category]) catMap[w.category] = [];
    catMap[w.category].push(w);
  });

  const availableCats = Object.keys(catMap).filter((k) => catMap[k].length >= 2);
  if (availableCats.length < 2) {
    // Fall back to all words
    return initSortGameFallback();
  }

  // Pick 2-3 categories
  const pickedCats = shuffle(availableCats).slice(0, Math.min(3, availableCats.length));

  // Gather 2-3 words from each
  const queue = [];
  pickedCats.forEach((cat) => {
    const catWords = shuffle(catMap[cat]).slice(0, 3);
    queue.push(...catWords);
  });

  const buckets = pickedCats.map((catKey) => {
    const catDef = CATEGORIES.find((c) => c.key === catKey) || { label: catKey, icon: "\uD83D\uDCE6" };
    return { category: catKey, label: catDef.label, icon: catDef.icon, items: [] };
  });

  state.sort.queue = shuffle(queue);
  state.sort.buckets = buckets;
  state.sort.correct = 0;
  state.sort.total = queue.length;
  state.sort.currentItem = state.sort.queue.shift() || null;

  renderSortGame();
}

function initSortGameFallback() {
  // Use all words, pick random categories
  const catMap = {};
  WORDS.forEach((w) => {
    if (!catMap[w.category]) catMap[w.category] = [];
    catMap[w.category].push(w);
  });

  const availableCats = Object.keys(catMap).filter((k) => catMap[k].length >= 2);
  const pickedCats = shuffle(availableCats).slice(0, 3);

  const queue = [];
  pickedCats.forEach((cat) => {
    const catWords = shuffle(catMap[cat]).slice(0, 3);
    queue.push(...catWords);
  });

  const buckets = pickedCats.map((catKey) => {
    const catDef = CATEGORIES.find((c) => c.key === catKey) || { label: catKey, icon: "\uD83D\uDCE6" };
    return { category: catKey, label: catDef.label, icon: catDef.icon, items: [] };
  });

  state.sort.queue = shuffle(queue);
  state.sort.buckets = buckets;
  state.sort.correct = 0;
  state.sort.total = queue.length;
  state.sort.currentItem = state.sort.queue.shift() || null;

  renderSortGame();
}

function renderSortGame() {
  if (!el.sortItem || !el.sortBuckets) return;

  // Render current item
  el.sortItem.innerHTML = "";
  if (state.sort.currentItem) {
    const entry = state.sort.currentItem;
    const artDiv = document.createElement("div");
    artDiv.className = "sort-item-art";
    artDiv.innerHTML = entry.art;
    artDiv.dataset.draggable = "sort-item";

    const wordDiv = document.createElement("div");
    wordDiv.className = "sort-item-word";
    wordDiv.textContent = formatDisplayText(entry.word);

    const countDiv = document.createElement("div");
    countDiv.style.cssText = "font-size:0.75rem;color:var(--text-faint);font-weight:700;";
    countDiv.textContent = `${state.sort.correct} / ${state.sort.total}`;

    el.sortItem.appendChild(artDiv);
    el.sortItem.appendChild(wordDiv);
    el.sortItem.appendChild(countDiv);
  } else {
    el.sortItem.innerHTML = `<div style="font-family:Fredoka,sans-serif;font-size:1.2rem;font-weight:700;color:var(--text-faint);">All done!</div>`;
  }

  // Render buckets
  el.sortBuckets.innerHTML = "";
  state.sort.buckets.forEach((bucket) => {
    const bucketEl = document.createElement("button");
    bucketEl.type = "button";
    bucketEl.className = "sort-bucket";
    bucketEl.dataset.category = bucket.category;
    bucketEl.dataset.dropTarget = "sort-bucket";
    bucketEl.innerHTML = `
      <span class="sort-bucket-icon">${bucket.icon}</span>
      <span class="sort-bucket-label">${bucket.label}</span>
      <span class="sort-bucket-count">${bucket.items.length} items</span>
    `;
    bucketEl.addEventListener("click", () => handleSortTap(bucket.category));
    el.sortBuckets.appendChild(bucketEl);
  });

  // Setup drag & drop for sort game
  if (state.sort.currentItem) {
    setupDragDrop(
      el.sortGame,
      "[data-draggable='sort-item']",
      "[data-drop-target='sort-bucket']",
      (dragged, target) => {
        const cat = target.dataset.category;
        if (cat) handleSortTap(cat);
      }
    );
  }
}

function handleSortTap(bucketCategory) {
  if (!state.sort.currentItem) return;

  const entry = state.sort.currentItem;
  const isCorrect = entry.category === bucketCategory;

  const bucketEl = el.sortBuckets.querySelector(`[data-category="${bucketCategory}"]`);

  if (isCorrect) {
    // Correct!
    const bucket = state.sort.buckets.find((b) => b.category === bucketCategory);
    if (bucket) bucket.items.push(entry);
    state.sort.correct++;

    if (bucketEl) {
      bucketEl.classList.add("correct");
      bucketEl.addEventListener("animationend", () => bucketEl.classList.remove("correct"), { once: true });
    }

    playCorrectSound();
    showMascotBubble(randomPhrase("sortCorrect"), 1500);
    animateMascotReaction("happy");

    // Speak the word
    speakText(entry.label, { rate: getTeachingWordRate() });

    // Advance queue
    state.sort.currentItem = state.sort.queue.shift() || null;

    if (!state.sort.currentItem) {
      // All done!
      setTimeout(() => {
        showCelebration(entry);
        playSuccessChime();
        showMascotBubble(randomPhrase("sortComplete"), 3000);
        setTimeout(() => initSortGame(), 3500);
      }, 600);
    }

    renderSortGame();
  } else {
    // Wrong
    playWrongSound();
    if (bucketEl) {
      bucketEl.classList.add("wrong");
      bucketEl.addEventListener("animationend", () => bucketEl.classList.remove("wrong"), { once: true });
    }
    animateMascotReaction("sad");

    // Show hint
    const correctCat = CATEGORIES.find((c) => c.key === entry.category);
    if (correctCat) {
      showToast(`Hint: ${correctCat.icon} ${correctCat.label}`, "warning");
    }
  }
}

// === DRAG & DROP SYSTEM ===

function setupDragDrop(container, draggableSelector, dropTargetSelector, onDrop) {
  if (!container) return;

  const draggables = container.querySelectorAll(draggableSelector);

  draggables.forEach((draggable) => {
    let ghost = null;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    draggable.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      isDragging = true;

      const rect = draggable.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Create ghost clone
      ghost = draggable.cloneNode(true);
      ghost.className = "drag-ghost";
      ghost.style.width = rect.width + "px";
      ghost.style.height = rect.height + "px";
      ghost.style.left = (e.clientX - offsetX) + "px";
      ghost.style.top = (e.clientY - offsetY) + "px";
      document.body.appendChild(ghost);

      draggable.classList.add("dragging");
      draggable.setPointerCapture(e.pointerId);
    });

    draggable.addEventListener("pointermove", (e) => {
      if (!isDragging || !ghost) return;
      e.preventDefault();

      ghost.style.left = (e.clientX - offsetX) + "px";
      ghost.style.top = (e.clientY - offsetY) + "px";

      // Detect drop target
      ghost.style.display = "none";
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      ghost.style.display = "";

      // Clear all hover states
      container.querySelectorAll(dropTargetSelector).forEach((t) => t.classList.remove("drag-hover"));

      if (elementBelow) {
        const target = elementBelow.closest(dropTargetSelector);
        if (target) target.classList.add("drag-hover");
      }
    });

    draggable.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;

      // Find drop target
      if (ghost) ghost.style.display = "none";
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      if (ghost) ghost.style.display = "";

      // Clear hover states
      container.querySelectorAll(dropTargetSelector).forEach((t) => t.classList.remove("drag-hover"));

      if (elementBelow) {
        const target = elementBelow.closest(dropTargetSelector);
        if (target) {
          onDrop(draggable, target);
        }
      }

      // Cleanup
      draggable.classList.remove("dragging");
      if (ghost) {
        ghost.remove();
        ghost = null;
      }
    });

    draggable.addEventListener("pointercancel", () => {
      isDragging = false;
      draggable.classList.remove("dragging");
      container.querySelectorAll(dropTargetSelector).forEach((t) => t.classList.remove("drag-hover"));
      if (ghost) {
        ghost.remove();
        ghost = null;
      }
    });
  });
}

// === START ===

document.addEventListener("DOMContentLoaded", init);
