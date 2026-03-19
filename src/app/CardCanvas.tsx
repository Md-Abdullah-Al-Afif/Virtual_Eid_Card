'use client'
import { CardData } from '@/lib/storage'

export default function CardCanvas({ card }: { card: CardData }) {
  if (card.tpl === 'moonlight') return <MoonCard card={card} />
  if (card.tpl === 'lantern')   return <LantCard card={card} />
  return <GeoCard card={card} />
}

/* ── SHARED PIECES ── */
function CornerDeco({ pos, color }: { pos: 'tl'|'tr'|'bl'|'br', color: string }) {
  const t: Record<string, React.CSSProperties> = {
    tl: { top: 12, left: 12 },
    tr: { top: 12, right: 12, transform: 'scaleX(-1)' },
    bl: { bottom: 12, left: 12, transform: 'scaleY(-1)' },
    br: { bottom: 12, right: 12, transform: 'scale(-1,-1)' },
  }
  return (
    <svg style={{ position: 'absolute', ...t[pos], pointerEvents: 'none', zIndex: 2 }} width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M5 25 L5 5 L25 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="5" cy="5" r="2.2" fill={color} />
    </svg>
  )
}

const STAR_POS = [[7,7],[14,4],[22,11],[33,3],[41,8],[50,5],[59,10],[67,6],[74,14],[81,4],[89,9],[93,5],[4,19],[11,27],[19,21],[28,29],[63,23],[76,19],[86,26],[91,32],[5,38],[18,44],[35,40],[52,36],[70,43],[88,38]]

/* ═══════════════════════════════════════════
   MOONLIT NIGHT
═══════════════════════════════════════════ */
function MoonCard({ card }: { card: CardData }) {
  return (
    <div className="ccard" style={{ background: 'linear-gradient(175deg,#020816 0%,#05091f 28%,#03101c 55%,#021208 100%)' }}>
      {/* Nebula */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'radial-gradient(ellipse at 50% 25%,rgba(20,35,100,.4) 0%,transparent 70%)', pointerEvents:'none' }} />
      {/* Stars */}
      {STAR_POS.map(([l, t], i) => (
        <div key={i} style={{
          position:'absolute', borderRadius:'50%',
          width: 0.7 + (i%4)*0.5, height: 0.7 + (i%4)*0.5,
          left:`${l}%`, top:`${t}%`,
          background: i%3===0 ? '#fde68a' : '#a7f3d0',
          opacity: 0.35+(i%5)*0.13,
          animation: `twinkle ${2+(i%3)}s ease-in-out ${i*0.14}s infinite`,
        }} />
      ))}

      {/* MOON — SVG clip-path crescent */}
      <div style={{ position:'relative', zIndex:3, marginTop:8, filter:'drop-shadow(0 0 22px rgba(253,230,138,.45))', animation:'float 8s ease-in-out infinite' }}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <defs>
            <radialGradient id="mg" cx="38%" cy="33%" r="65%">
              <stop offset="0%"   stopColor="#fffbea" />
              <stop offset="35%"  stopColor="#fde68a" />
              <stop offset="75%"  stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <clipPath id="mc"><circle cx="60" cy="60" r="30" /></clipPath>
          </defs>
          {/* Glow halos */}
          <circle cx="60" cy="60" r="44" fill="rgba(253,230,138,.04)" />
          <circle cx="60" cy="60" r="37" fill="rgba(253,230,138,.07)" />
          {/* Full moon */}
          <circle cx="60" cy="60" r="30" fill="url(#mg)" />
          {/* Shadow circle offset right → carves crescent */}
          <circle cx="73" cy="55" r="26" fill="#03101c" clipPath="url(#mc)" />
          {/* Craters on visible area */}
          <circle cx="43" cy="52" r="2.2" fill="rgba(160,110,5,.38)" clipPath="url(#mc)" />
          <circle cx="47" cy="64" r="1.5" fill="rgba(160,110,5,.3)"  clipPath="url(#mc)" />
          <circle cx="38" cy="62" r="1.1" fill="rgba(160,110,5,.25)" clipPath="url(#mc)" />
          {/* Rim */}
          <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(255,248,200,.22)" strokeWidth=".8" />
          {/* Sparkle tips */}
          <line x1="31" y1="42" x2="31" y2="48" stroke="#fde68a" strokeWidth=".9" opacity=".7" />
          <line x1="28" y1="45" x2="34" y2="45" stroke="#fde68a" strokeWidth=".9" opacity=".7" />
          <line x1="29" y1="72" x2="29" y2="76" stroke="#fde68a" strokeWidth=".8" opacity=".5" />
          <line x1="27" y1="74" x2="31" y2="74" stroke="#fde68a" strokeWidth=".8" opacity=".5" />
        </svg>
      </div>

      {/* Arabic + Bangla greeting */}
      <div style={{ position:'relative', zIndex:3, textAlign:'center', width:'100%' }}>
        <p style={{ fontFamily:'Amiri,serif', fontSize:34, color:'#fde68a', lineHeight:1.3, textShadow:'0 0 32px rgba(251,191,36,.6),0 0 60px rgba(251,191,36,.22)' }}>عيد مبارك</p>
        <div style={{ margin:'10px auto', width:'78%', height:1, background:'linear-gradient(90deg,transparent,rgba(251,191,36,.52),transparent)' }} />
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:21, color:'#fde68a', fontWeight:700, letterSpacing:3, textShadow:'0 0 22px rgba(251,191,36,.42)' }}>ঈদ মোবারক</p>
      </div>

      {/* Message box */}
      <div style={{ position:'relative', zIndex:3, width:'100%', textAlign:'center' }}>
        {card.rn && <p style={{ fontSize:13, color:'rgba(167,243,208,.72)', marginBottom:7 }}>প্রিয় <strong style={{ color:'#a7f3d0' }}>{card.rn}</strong>,</p>}
        <div style={{ background:'rgba(2,8,22,.55)', border:'1px solid rgba(251,191,36,.2)', borderRadius:14, padding:'14px 15px', backdropFilter:'blur(10px)' }}>
          <p style={{ fontSize:13, color:'rgba(240,253,244,.82)', lineHeight:1.75, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{card.msg}</p>
        </div>
        <div style={{ margin:'10px auto', width:'58%', height:1, background:'linear-gradient(90deg,transparent,rgba(251,191,36,.28),transparent)' }} />
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:13.5, color:'rgba(251,191,36,.82)', fontStyle:'italic' }}>— {card.sig}</p>
      </div>

      {/* Footer ornament */}
      <div style={{ position:'relative', zIndex:3, display:'flex', alignItems:'center', gap:9, fontSize:13, color:'rgba(251,191,36,.38)' }}>
        <span>✦</span><span style={{ fontSize:17 }}>☽</span>
        <span style={{ fontSize:10, letterSpacing:2, color:'rgba(167,243,208,.38)' }}>ঈদ মোবারক</span>
        <span style={{ fontSize:17 }}>☾</span><span>✦</span>
      </div>

      {/* Frame */}
      <div style={{ position:'absolute', inset:0, borderRadius:22, boxShadow:'inset 0 0 0 1px rgba(251,191,36,.18),inset 0 0 80px rgba(16,185,129,.04)', pointerEvents:'none', zIndex:4 }} />
      <CornerDeco pos="tl" color="rgba(251,191,36,.3)" />
      <CornerDeco pos="tr" color="rgba(251,191,36,.3)" />
      <CornerDeco pos="bl" color="rgba(251,191,36,.3)" />
      <CornerDeco pos="br" color="rgba(251,191,36,.3)" />
    </div>
  )
}

/* ═══════════════════════════════════════════
   GOLDEN LANTERN
═══════════════════════════════════════════ */
function Lantern({ cx, y }: { cx: number; y: number }) {
  const w = 34
  return (
    <g transform={`translate(${cx - w / 2},${y})`}>
      <ellipse cx={w/2} cy="5" rx={w/2} ry="4" fill="rgba(160,90,0,.5)" stroke="#fbbf24" strokeWidth="1.1" />
      <path d={`M3 5 Q1 30 3 54 L${w-3} 54 Q${w-1} 30 ${w-3} 5 Z`} fill="rgba(251,150,36,.12)" stroke="#fbbf24" strokeWidth="1.1" />
      {[w/4, w/2, 3*w/4].map((x, i) => <line key={i} x1={x} y1="5" x2={x} y2="54" stroke="rgba(251,191,36,.28)" strokeWidth=".6" />)}
      <ellipse cx={w/2} cy="29" rx={w/2-1} ry="3.5" fill="none" stroke="rgba(251,191,36,.38)" strokeWidth=".8" />
      <ellipse cx={w/2} cy="29" rx="11" ry="15" fill="rgba(251,191,36,.22)" />
      <ellipse cx={w/2} cy="29" rx="5"  ry="8"  fill="rgba(253,230,138,.18)" />
      <ellipse cx={w/2} cy="54" rx={w/2} ry="4" fill="rgba(160,90,0,.5)" stroke="#fbbf24" strokeWidth="1.1" />
      {[-4,0,4].map((dx, i) => <line key={i} x1={w/2+dx} y1="58" x2={w/2+dx} y2={68+i*4} stroke="rgba(251,191,36,.45)" strokeWidth="1" />)}
    </g>
  )
}

function LantCard({ card }: { card: CardData }) {
  return (
    <div className="ccard" style={{ background:'linear-gradient(175deg,#120400 0%,#200a00 35%,#180600 65%,#0e0300 100%)', justifyContent:'space-evenly' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%', background:'radial-gradient(ellipse at 50% 0%,rgba(251,130,0,.1) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:0, left:'7%', right:'7%', height:1, background:'rgba(251,191,36,.22)' }} />

      {/* Lanterns */}
      <div style={{ position:'relative', zIndex:3, width:'100%', marginTop:0 }}>
        <svg width="100%" height="95" viewBox="0 0 300 95" fill="none" preserveAspectRatio="xMidYMid meet">
          {[60, 150, 240].map(cx => (
            <g key={cx}>
              <line x1={cx} y1="0" x2={cx} y2="16" stroke="rgba(251,191,36,.38)" strokeWidth="1" />
              <Lantern cx={cx} y={16} />
            </g>
          ))}
        </svg>
      </div>

      {/* Greeting */}
      <div style={{ position:'relative', zIndex:3, textAlign:'center', width:'100%' }}>
        <p style={{ fontFamily:"'Scheherazade New', Amiri, serif", fontSize:34, color:'#fde68a', textShadow:'0 0 32px rgba(251,191,36,.62),0 0 60px rgba(251,100,0,.2)', unicodeBidi:'bidi-override', direction:'rtl' }}>عيد مبارك</p>
        <div style={{ margin:'8px auto', width:'70%', height:1, background:'linear-gradient(90deg,transparent,rgba(251,191,36,.55),transparent)' }} />
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#fde68a', fontWeight:700, textShadow:'0 0 20px rgba(251,191,36,.46)' }}>ঈদ মোবারক</p>
      </div>

      {/* Message */}
      <div style={{ position:'relative', zIndex:3, width:'100%', textAlign:'center' }}>
        {card.rn && <p style={{ fontSize:13, color:'rgba(253,186,116,.75)', marginBottom:8 }}>প্রিয় <strong style={{ color:'#fbbf24' }}>{card.rn}</strong>,</p>}
        <div style={{ background:'rgba(18,6,0,.58)', border:'1px solid rgba(251,150,36,.22)', borderRadius:14, padding:'14px 15px', backdropFilter:'blur(10px)' }}>
          <p style={{ fontSize:13, color:'rgba(253,230,138,.82)', lineHeight:1.75, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{card.msg}</p>
        </div>
        <div style={{ margin:'10px auto', width:'58%', height:1, background:'linear-gradient(90deg,transparent,rgba(251,191,36,.28),transparent)' }} />
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:13.5, color:'rgba(251,191,36,.8)', fontStyle:'italic' }}>— {card.sig}</p>
      </div>

      <div style={{ position:'relative', zIndex:3, fontSize:11.5, color:'rgba(251,191,36,.35)', letterSpacing:4, fontWeight:600 }}>✦ ঈদ ✦ EID ✦ عيد ✦</div>
      <div style={{ position:'absolute', inset:0, borderRadius:22, boxShadow:'inset 0 0 0 1px rgba(251,191,36,.16),inset 0 0 100px rgba(251,120,0,.05)', pointerEvents:'none', zIndex:4 }} />
      <CornerDeco pos="tl" color="rgba(251,150,36,.28)" />
      <CornerDeco pos="tr" color="rgba(251,150,36,.28)" />
      <CornerDeco pos="bl" color="rgba(251,150,36,.28)" />
      <CornerDeco pos="br" color="rgba(251,150,36,.28)" />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ISLAMIC GEOMETRIC
═══════════════════════════════════════════ */
function GeoCard({ card }: { card: CardData }) {
  const tiles: React.ReactNode[] = []
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const tx = c * 60 + (r % 2) * 30
      const ty = r * 55 - 10
      tiles.push(
        <g key={`${r}-${c}`} transform={`translate(${tx},${ty})`} opacity=".16">
          <polygon points="30,2 35,12 46,12 38,20 41,31 30,25 19,31 22,20 14,12 25,12" stroke="#6ee7b7" strokeWidth=".65" fill="none" />
        </g>
      )
    }
  }
  return (
    <div className="ccard" style={{ background: 'linear-gradient(175deg,#011a0e 0%,#033020 35%,#044028 55%,#021d10 100%)' }}>
      {/* Tiled pattern */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">{tiles}</svg>
      {/* Radial glow */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 65% 50% at 50% 44%,rgba(16,185,129,.13) 0%,transparent 70%)', pointerEvents:'none' }} />

      {/* Star */}
      <div style={{ position:'relative', zIndex:3, marginTop:10, filter:'drop-shadow(0 0 14px rgba(110,231,183,.35))', animation:'float 9s ease-in-out infinite' }}>
        <svg width="124" height="124" viewBox="0 0 124 124" fill="none">
          <circle cx="62" cy="62" r="57" stroke="rgba(110,231,183,.1)"  strokeWidth="1" strokeDasharray="4 7" />
          <circle cx="62" cy="62" r="48" stroke="rgba(110,231,183,.13)" strokeWidth=".9" />
          <polygon points="62,10 70,36 96,36 76,54 84,80 62,64 40,80 48,54 28,36 54,36" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
          <polygon points="62,22 68,40 88,40 74,52 80,70 62,60 44,70 50,52 36,40 56,40" fill="rgba(110,231,183,.1)" stroke="#34d399" strokeWidth="1" />
          <polygon points="62,38 72,48 72,58 62,68 52,58 52,48" fill="rgba(16,185,129,.12)" stroke="#10b981" strokeWidth=".8" />
          <circle cx="62" cy="56" r="10" fill="rgba(110,231,183,.2)"  stroke="#6ee7b7"  strokeWidth="1.1" />
          <circle cx="62" cy="56" r="5"  fill="rgba(52,211,153,.35)"  stroke="#34d399"  strokeWidth=".9" />
          <polygon points="62,5 65.5,13 62,21 58.5,13" fill="rgba(110,231,183,.45)" />
          <polygon points="119,56 111,59.5 103,56 111,52.5" fill="rgba(110,231,183,.45)" />
          <polygon points="62,119 58.5,111 62,103 65.5,111" fill="rgba(110,231,183,.45)" />
          <polygon points="5,56 13,52.5 21,56 13,59.5" fill="rgba(110,231,183,.45)" />
        </svg>
      </div>

      {/* Greeting */}
      <div style={{ position:'relative', zIndex:3, textAlign:'center', width:'100%' }}>
        <p style={{ fontFamily:'Amiri,serif', fontSize:33, color:'#a7f3d0', textShadow:'0 0 28px rgba(52,211,153,.52)' }}>عيد مبارك</p>
        <div style={{ margin:'9px auto', width:'72%', height:1, background:'linear-gradient(90deg,transparent,rgba(110,231,183,.5),transparent)' }} />
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:21, color:'#6ee7b7', fontWeight:700, textShadow:'0 0 18px rgba(52,211,153,.4)' }}>ঈদ মোবারক</p>
      </div>

      {/* Message */}
      <div style={{ position:'relative', zIndex:3, width:'100%', textAlign:'center' }}>
        {card.rn && <p style={{ fontSize:13, color:'rgba(110,231,183,.72)', marginBottom:8 }}>প্রিয় <strong style={{ color:'#6ee7b7' }}>{card.rn}</strong>,</p>}
        <div style={{ background:'rgba(1,18,10,.62)', border:'1px solid rgba(110,231,183,.2)', borderRadius:14, padding:'14px 15px', backdropFilter:'blur(10px)' }}>
          <p style={{ fontSize:13, color:'rgba(240,253,244,.8)', lineHeight:1.75, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{card.msg}</p>
        </div>
        <div style={{ margin:'10px auto', width:'58%', height:1, background:'linear-gradient(90deg,transparent,rgba(110,231,183,.28),transparent)' }} />
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:13.5, color:'rgba(110,231,183,.8)', fontStyle:'italic' }}>— {card.sig}</p>
      </div>

      <div style={{ position:'relative', zIndex:3, display:'flex', alignItems:'center', gap:9, fontSize:12, color:'rgba(110,231,183,.35)', letterSpacing:2 }}>
        <span>✦</span><span>◆</span><span style={{ fontSize:10 }}>ঈদ মোবারক</span><span>◆</span><span>✦</span>
      </div>
      <div style={{ position:'absolute', inset:0, borderRadius:22, boxShadow:'inset 0 0 0 1px rgba(110,231,183,.18)', pointerEvents:'none', zIndex:4 }} />
      <CornerDeco pos="tl" color="rgba(110,231,183,.28)" />
      <CornerDeco pos="tr" color="rgba(110,231,183,.28)" />
      <CornerDeco pos="bl" color="rgba(110,231,183,.28)" />
      <CornerDeco pos="br" color="rgba(110,231,183,.28)" />
    </div>
  )
}
