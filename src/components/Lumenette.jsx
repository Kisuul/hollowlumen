import { useId } from 'react';
import { COLORS } from '../state/game.js';

/** Original SVG companion art: deliberately local, lightweight and scalable. */
export function Lumenette({ name = 'Pip', color = 'rose', face = 'smile', accessory = 'scarf', className = '' }) {
  const gradientId = useId().replace(/:/g, '');
  const shade = COLORS.find((item) => item.id === color)?.hex ?? COLORS[0].hex;
  return (
    <svg className={`lumenette ${className}`} viewBox="0 0 240 240" role="img" aria-label={`${name}, a smiling yarn companion`}>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="77%">
          <stop offset="0" stopColor="#fff9f1" stopOpacity=".93" />
          <stop offset=".36" stopColor={shade} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="213" rx="74" ry="12" fill="#5b5545" opacity=".16" />
      <path d="M58 105 C26 72 53 42 83 49 M170 49 C193 27 215 62 192 86" fill="none" stroke={shade} strokeWidth="18" strokeLinecap="round" />
      <circle cx="120" cy="117" r="83" fill={`url(#${gradientId})`} stroke="#986e70" strokeOpacity=".25" strokeWidth="3" />
      <g fill="none" stroke="#fffaf2" strokeOpacity=".56" strokeWidth="4" strokeLinecap="round">
        <path d="M71 53 C120 77 156 114 174 175" />
        <path d="M54 80 C99 95 147 148 151 189" />
        <path d="M47 111 C86 124 119 162 121 199" />
        <path d="M82 42 C128 65 178 100 197 132" />
        <path d="M108 37 C150 57 189 93 200 113" />
        <path d="M43 141 C74 153 94 173 100 196" />
      </g>
      <g fill="none" stroke="#80515b" strokeOpacity=".26" strokeWidth="2" strokeLinecap="round">
        <path d="M56 109 q36 -4 60 16 M114 75 q40 9 60 42 M79 161 q39 2 71 24" />
      </g>
      <ellipse cx="86" cy="140" rx="14" ry="7" fill="#e07786" opacity=".39" />
      <ellipse cx="158" cy="140" rx="14" ry="7" fill="#e07786" opacity=".39" />
      {face === 'sleepy' ? (
        <g fill="none" stroke="#514047" strokeWidth="5" strokeLinecap="round">
          <path d="M83 119 q10 9 21 0 M139 119 q10 9 21 0 M115 145 q6 5 12 0" />
        </g>
      ) : (
        <>
          <ellipse cx="93" cy="118" rx="5.5" ry={face === 'bright' ? 8 : 6.5} fill="#443841" />
          <ellipse cx="149" cy="118" rx="5.5" ry={face === 'bright' ? 8 : 6.5} fill="#443841" />
          <path d={face === 'bright' ? 'M112 140 Q121 157 131 140' : 'M113 141 Q121 149 129 141'} fill="none" stroke="#443841" strokeWidth="4" strokeLinecap="round" />
          <circle cx="95" cy="115" r="2" fill="white" />
          <circle cx="151" cy="115" r="2" fill="white" />
        </>
      )}
      {accessory === 'scarf' && (
        <g>
          <path d="M70 174 Q120 197 173 171" stroke="#efdfb6" fill="none" strokeWidth="18" strokeLinecap="round" />
          <path d="M151 180 Q167 191 158 219" stroke="#efdfb6" fill="none" strokeWidth="15" strokeLinecap="round" />
          <path d="M151 203 l4 13 m-12-9 l4 11" stroke="#d2b383" strokeWidth="2" />
        </g>
      )}
      {accessory === 'bow' && (
        <g transform="translate(163 63)">
          <path d="M0 9 Q-32 -18 -30 12 Q-30 40 0 18 Q30 40 30 12 Q32 -18 0 9" fill="#f8e2bc" stroke="#cba679" strokeWidth="3" />
          <circle cy="13" r="8" fill="#e9bda1" />
        </g>
      )}
      {accessory === 'flower' && (
        <g transform="translate(163 61)">
          {[0, 72, 144, 216, 288].map((angle) => <ellipse key={angle} cy="-11" ry="12" rx="8" transform={`rotate(${angle})`} fill="#fff2cf" stroke="#d6aa6a" strokeWidth="1" />)}
          <circle r="8" fill="#e9bb68" />
        </g>
      )}
    </svg>
  );
}
