const petalColors = [
  "#FF6B6B", // vibrant coral red
  "#FFA69E", // warm blush
  "#FFB347", // vivid peach
  "#FFD166", // golden yellow
  "#70C1B3", // ocean teal
  "#5FAD56", // fresh green
  "#6A94FF", // periwinkle blue
  "#A685E2"  // soft violet
];

// Utility to generate a random color from palette
function getRandomColor() {
  const i = Math.floor(Math.random() * petalColors.length);
  return petalColors[i];
}

// Generate petal SVG path
function generatePetal(angleDeg, radius, color,rx=10) {
  // The petal will be drawn vertically, then rotated
  // The base of the petal is at the center (150, 130)
  // The tip is at (150, 130 - radius)
  return `
    <ellipse 
      cx="150" 
      cy="${130 - radius}" 
      rx="${rx}" 
      ry="${radius}" 
      fill="${color}" 
      stroke="#fff" stroke-width="2"
      transform="rotate(${angleDeg}, 150, 130)"
    />
  `;
}

// Generate the full flower SVG string
export function generateFlowerSVG(petalCount = 0) {
  const petals = [];

  // Generate up to 8 petals
  for (let i = 0; i < Math.min(petalCount, 8); i++) {
    const angle = (360 / petalCount) * i+45;
    const color = getRandomColor();
    var rx=10;
    if(petalCount<3){
      rx=15;
    }
    else if(petalCount<4){
      rx=12;
    }
 
    petals.push(generatePetal(angle, 20, color,rx));
  }

  // Center (flower core) - smaller circle, moved higher
  const center = `<circle cx="150" cy="130" r="7" fill="#333"   stroke="#fff" stroke-width="2"/>`;

  // Leaves (2 static) - moved upward and enlarged, with adjusted positions
  const leaves = `
    <path d="M 120 175 Q 120 195 135 205 Q 150 195 120 175" fill="#4CAF50" />
    <path d="M 180 185 Q 180 205 165 215 Q 150 205 180 185" fill="#4CAF50" />
  `;

  // Stem - thinner and curly, made longer and starts higher
  const stem = `
    <path d="M 150 150 Q 148 170 150 190 Q 152 210 150 230 Q 148 250 150 270" 
          stroke="#2E7D32" stroke-width="4" fill="none" />
  `;

  // Use the first palette as default
  const [potBodyColor, potStripeColor] = potColorPalettes[7];

  // Minimalistic pot below the plant, using palette colors
  const pot = `
    <g>
      <!-- Pot body: semicircle with flat top -->
      <path d="M 100 225 Q 150 285 200 225 Q 200 255 150 270 Q 100 255 100 225 Z" fill="${potBodyColor}" stroke="none"/>
      <rect x="100" y="225" width="100" height="12" fill="${potBodyColor}" stroke="none"/>
      <!-- Pot stripes -->
      <g stroke="${potStripeColor}" stroke-width="2" fill="none">
        <path d="M 105 235 Q 150 245 195 235" />
        <path d="M 105 240 Q 150 250 195 240" />
        <path d="M 105 245 Q 150 255 195 245" />
        <path d="M 105 250 Q 150 260 195 250" />
        <path d="M 105 255 Q 150 265 195 255" />
        <path d="M 110 260 Q 150 270 190 260" />
        <path d="M 115 265 Q 150 275 185 265" />
      </g>
    </g>
  `;

  // Combine everything
  return `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      ${leaves}
      ${stem}
      ${petals.join("\n")}
      ${center}
      ${pot}
    </svg>
  `;
}

// Pot color palettes: 4x4 options for striped and solid pots
export const potColorPalettes = [
  // Each entry: [body, stripe]
  ["#F9F9E3", "#BFCF6A"], // light cream + olive stripe
  ["#FFE5B4", "#FFB347"], // pastel orange + vivid peach stripe
  ["#E0BBE4", "#957DAD"], // lavender + muted purple stripe
  ["#B5EAD7", "#70C1B3"], // mint + teal stripe
  ["#FFF1BA", "#FFD166"], // pastel yellow + golden stripe
  ["#B5D8FA", "#6A94FF"], // pastel blue + periwinkle stripe
  ["#FFD1DC", "#FF6B6B"], // pastel pink + coral stripe
  ["#E2F0CB", "#5FAD56"], // pastel green + fresh green stripe

];
  