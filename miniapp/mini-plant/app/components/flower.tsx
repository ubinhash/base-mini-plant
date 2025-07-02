import React, { useState } from 'react';
import { generateFlowerSVG } from './genflower.js';

export default function FlowerRenderer() {
  const [petalCount, setPetalCount] = useState(0);

  const addPetal = () => {
    setPetalCount(p => Math.min(8, p + 1));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div 
        key={petalCount} 
        dangerouslySetInnerHTML={{ __html: generateFlowerSVG(petalCount) }} 
      />
      <button onClick={addPetal} disabled={petalCount >= 8}>
        Add Petal
      </button>
    </div>
  );
}
