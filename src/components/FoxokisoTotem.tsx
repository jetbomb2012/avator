
import React from 'react';

// --- HUA QI ER (花琪兒) TOTEM SVG (FORMERLY FOXOKISO) ---
// Design: Double Hexagon + Word Frame (Industrial Style)
// Text: "花琪兒" (Default) or Custom Kanji
const FoxokisoTotem: React.FC<{ className?: string, color?: string, kanji?: string }> = ({ className = "w-12 h-12", color = "currentColor", kanji }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Hexagon (The Alliance) */}
    <path d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 Z" stroke={color} strokeWidth="3" strokeLinejoin="round" />
    
    {/* Inner Hexagon (The Core) */}
    <path d="M50 20 L76 35 V65 L50 80 L24 65 V35 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    
    {/* Connecting Circuits (Energy Flow) */}
    <path d="M50 5 V20 M90 27.5 L76 35 M90 72.5 L76 65 M50 95 V80 M10 72.5 L24 65 M10 27.5 L24 35" stroke={color} strokeWidth="1" opacity="0.6" />
    
    {/* Central Word Frame (The Seal) */}
    <rect x="22" y="42" width="56" height="16" stroke={color} strokeWidth="2" fill="none" />
    
    {/* Text inside Frame */}
    <text x="50" y="53.5" textAnchor="middle" fontSize="10" fill={color} fontFamily="serif" fontWeight="bold" letterSpacing="0.1em">
      {kanji || "花琪兒"}
    </text>
    
    {/* Lower Code */}
    <text x="50" y="75" textAnchor="middle" fontSize="4" fill={color} fontFamily="monospace" letterSpacing="1" opacity="0.8">FOXOKISO</text>
  </svg>
);

export default FoxokisoTotem;
