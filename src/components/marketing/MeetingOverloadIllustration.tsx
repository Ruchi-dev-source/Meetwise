export function MeetingOverloadIllustration() {
  return (
    <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a clock surrounded by overlapping, fragmented meeting blocks">
      <defs>
        <linearGradient id="moi-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="moi-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EC4899" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <radialGradient id="moi-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity="0.25" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="160" r="140" fill="url(#moi-glow)" />

      {/* Fragmented, overlapping meeting cards drifting away from center clock */}
      <g opacity="0.9">
        <rect x="34" y="46" width="86" height="52" rx="10" fill="#0d0d11" stroke="url(#moi-a)" strokeWidth="1.5" />
        <line x1="48" y1="64" x2="90" y2="64" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="48" y1="76" x2="76" y2="76" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </g>
      <g opacity="0.85">
        <rect x="284" y="30" width="84" height="52" rx="10" fill="#0d0d11" stroke="url(#moi-b)" strokeWidth="1.5" />
        <line x1="298" y1="48" x2="338" y2="48" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="298" y1="60" x2="322" y2="60" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </g>
      <g opacity="0.8">
        <rect x="290" y="210" width="80" height="50" rx="10" fill="#0d0d11" stroke="url(#moi-a)" strokeWidth="1.5" />
        <line x1="304" y1="228" x2="342" y2="228" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="304" y1="240" x2="326" y2="240" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      </g>
      <g opacity="0.75">
        <rect x="30" y="222" width="78" height="48" rx="10" fill="#0d0d11" stroke="url(#moi-b)" strokeWidth="1.5" />
        <line x1="44" y1="240" x2="80" y2="240" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Dashed connective lines back to the clock, suggesting fragmentation */}
      <g stroke="#8B5CF6" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 6">
        <line x1="120" y1="80" x2="168" y2="130" />
        <line x1="284" y1="70" x2="232" y2="120" />
        <line x1="290" y1="222" x2="238" y2="185" />
        <line x1="108" y1="240" x2="162" y2="192" />
      </g>

      {/* Central clock — the thing meetings are actually costing */}
      <circle cx="200" cy="160" r="62" fill="#0a0a0c" stroke="url(#moi-a)" strokeWidth="2.5" />
      <circle cx="200" cy="160" r="62" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="10" />
      <line x1="200" y1="160" x2="200" y2="120" stroke="#F3F4F6" strokeWidth="3" strokeLinecap="round" />
      <line x1="200" y1="160" x2="228" y2="172" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="160" r="4.5" fill="#ffffff" />

      {/* Tick marks */}
      <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round">
        <line x1="200" y1="104" x2="200" y2="112" />
        <line x1="200" y1="208" x2="200" y2="216" />
        <line x1="144" y1="160" x2="152" y2="160" />
        <line x1="248" y1="160" x2="256" y2="160" />
      </g>
    </svg>
  );
}
