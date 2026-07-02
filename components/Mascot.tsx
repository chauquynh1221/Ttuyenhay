// Linh vật Bongmeow — bộ SVG nhiều tư thế, phong cách kem/hồng đồng bộ logo.
// pose: 'wave' | 'read' | 'sleep' | 'celebrate' | 'confused'

type Pose = 'wave' | 'read' | 'sleep' | 'celebrate' | 'confused'

const C = {
  fur: '#FFFFFF',
  line: '#EBA6B8',
  ear: '#F8B4C6',
  blush: '#F8B4C6',
  eye: '#5B4650',
  nose: '#F26D8B',
  book: '#F26D8B',
  book2: '#FBD5DE',
  z: '#EBA6B8',
}

function Ears() {
  return (
    <>
      <path d="M26 40 L18 12 L48 30 Z" fill={C.fur} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
      <path d="M74 40 L82 12 L52 30 Z" fill={C.fur} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 34 L26 20 L42 30 Z" fill={C.ear} />
      <path d="M70 34 L74 20 L58 30 Z" fill={C.ear} />
    </>
  )
}
function Blush() {
  return (
    <>
      <ellipse cx="34" cy="60" rx="6" ry="4" fill={C.blush} opacity="0.75" />
      <ellipse cx="66" cy="60" rx="6" ry="4" fill={C.blush} opacity="0.75" />
    </>
  )
}
function Whiskers() {
  return (
    <g stroke={C.line} strokeWidth="1.8" strokeLinecap="round">
      <path d="M30 54 L14 51 M30 60 L15 62" />
      <path d="M70 54 L86 51 M70 60 L85 62" />
    </g>
  )
}

export default function Mascot({ pose = 'wave', className = '' }: { pose?: Pose; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      {pose === 'wave' && (
        <>
          <path d="M32 62 C24 62 20 78 22 90 C23 96 30 96 50 96 C70 96 77 96 78 90 C80 78 76 62 68 62 Z" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <path d="M74 60 C82 52 86 56 84 64 C83 70 76 70 72 66 Z" fill={C.fur} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="30" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <Ears /><Blush /><Whiskers />
          <path d="M40 49 Q44 43 48 49" stroke={C.eye} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M52 49 Q56 43 60 49" stroke={C.eye} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M48 54 h4 l-2 3 z" fill={C.nose} />
          <path d="M84 44 l3 -3 M88 50 l4 -1 M86 57 l3 2" stroke={C.nose} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {pose === 'read' && (
        <>
          <path d="M30 60 C22 60 18 80 22 92 C24 97 32 97 50 97 C68 97 76 97 78 92 C82 80 78 60 70 60 Z" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <circle cx="50" cy="46" r="29" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <Ears /><Blush />
          <path d="M41 47 Q44 43 47 47" stroke={C.eye} strokeWidth="3" strokeLinecap="round" />
          <path d="M53 47 Q56 43 59 47" stroke={C.eye} strokeWidth="3" strokeLinecap="round" />
          <path d="M48 51 h4 l-2 3 z" fill={C.nose} />
          {/* cuốn sách */}
          <path d="M28 74 L50 68 L72 74 L72 92 L50 87 L28 92 Z" fill={C.book2} stroke={C.book} strokeWidth="3" strokeLinejoin="round" />
          <path d="M50 68 L50 87" stroke={C.book} strokeWidth="3" />
        </>
      )}

      {pose === 'sleep' && (
        <>
          <path d="M20 74 C20 58 40 52 56 58 C74 64 84 60 84 72 C84 84 66 90 46 90 C30 90 20 86 20 74 Z" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <path d="M40 56 L34 42 L54 52 Z" fill={C.fur} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
          <path d="M43 53 L39 45 L50 51 Z" fill={C.ear} />
          <path d="M28 78 Q40 90 60 84" stroke={C.line} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M42 68 q4 3 8 0" stroke={C.eye} strokeWidth="3" strokeLinecap="round" />
          <path d="M56 68 q4 3 8 0" stroke={C.eye} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="46" cy="74" rx="5" ry="3" fill={C.blush} opacity="0.7" />
          <ellipse cx="66" cy="74" rx="5" ry="3" fill={C.blush} opacity="0.7" />
          {/* z z z */}
          <text x="70" y="40" fill={C.z} fontSize="14" fontWeight="700" fontFamily="sans-serif">z</text>
          <text x="80" y="30" fill={C.z} fontSize="11" fontWeight="700" fontFamily="sans-serif">z</text>
          <text x="88" y="22" fill={C.z} fontSize="8" fontWeight="700" fontFamily="sans-serif">z</text>
        </>
      )}

      {pose === 'celebrate' && (
        <>
          <path d="M32 60 C24 60 20 80 24 92 C26 97 33 97 50 97 C67 97 74 97 76 92 C80 80 76 60 68 60 Z" fill={C.fur} stroke={C.line} strokeWidth="3" />
          {/* hai tay giơ lên */}
          <path d="M30 60 C22 48 24 42 30 44 C34 45 36 54 38 60 Z" fill={C.fur} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
          <path d="M70 60 C78 48 76 42 70 44 C66 45 64 54 62 60 Z" fill={C.fur} stroke={C.line} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="48" r="28" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <Ears /><Blush />
          <circle cx="43" cy="47" r="3.2" fill={C.eye} />
          <circle cx="57" cy="47" r="3.2" fill={C.eye} />
          <path d="M44 54 q6 6 12 0" stroke={C.eye} strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* pháo giấy */}
          <circle cx="20" cy="34" r="2.5" fill={C.nose} />
          <circle cx="80" cy="34" r="2.5" fill="#8FB8ED" />
          <path d="M14 46 l3 -2 M86 46 l-3 -2 M50 10 l0 4" stroke={C.nose} strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {pose === 'confused' && (
        <>
          <path d="M32 62 C24 62 20 80 24 92 C26 97 33 97 50 97 C67 97 74 97 76 92 C80 80 76 62 68 62 Z" fill={C.fur} stroke={C.line} strokeWidth="3" />
          <g transform="rotate(-10 50 48)">
            <circle cx="50" cy="48" r="29" fill={C.fur} stroke={C.line} strokeWidth="3" />
            <Ears /><Blush />
            <circle cx="43" cy="48" r="3" fill={C.eye} />
            <path d="M53 48 Q57 44 61 48" stroke={C.eye} strokeWidth="3" strokeLinecap="round" />
            <path d="M47 54 h5 l-2.5 3 z" fill={C.nose} />
            <path d="M45 60 q5 -3 10 0" stroke={C.eye} strokeWidth="2.4" strokeLinecap="round" />
          </g>
          {/* dấu hỏi */}
          <text x="74" y="34" fill={C.nose} fontSize="24" fontWeight="800" fontFamily="sans-serif">?</text>
        </>
      )}
    </svg>
  )
}
