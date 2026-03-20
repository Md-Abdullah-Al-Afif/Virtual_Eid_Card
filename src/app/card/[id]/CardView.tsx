'use client'
import html2canvas from 'html2canvas'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CardData, getCard, incrementView } from '@/lib/storage'
import CardCanvas from '../../CardCanvas'

const STARS = Array.from({ length: 90 }, (_, i) => ({
  w: 0.8 + ((i * 7919) % 26) / 10,
  l: ((i * 6271) % 1000) / 10,
  t: ((i * 3571) % 600) / 10,
  gold: i % 3 === 0,
  dur: 1.6 + ((i * 1009) % 35) / 10,
  del: ((i * 2503) % 25) / 10,
  op: 0.25 + ((i * 1301) % 75) / 100,
}))

export default function CardView({ id }: { id: string }) {
  const router = useRouter()
  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [salamiOpen, setSalamiOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadCard() {
      const found = await getCard(id)
      if (found) {
        await incrementView(id)
        setCard({ ...found, vc: found.vc + 1 })
      }
      setLoading(false)
    }
    loadCard()
  }, [id])

  useEffect(() => {
    if (!qrOpen || !card) return
    const canvas = document.getElementById('qrc') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const url = `${window.location.origin}/card/${id}`
    canvas.width = canvas.height = 160
    ctx.fillStyle = '#020c06'
    ctx.fillRect(0, 0, 160, 160)
    let seed = 0
    for (let i = 0; i < url.length; i++) seed = (seed * 31 + url.charCodeAt(i)) & 0x7fffffff
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
    const cs = 160 / 25
    const finder = (row: number, col: number) => {
      const p = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,1,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
        ctx.fillStyle = p[r][c] ? '#fbbf24' : '#020c06'
        ctx.fillRect((col+c)*cs+0.5, (row+r)*cs+0.5, cs-1, cs-1)
      }
    }
    for (let r = 0; r < 25; r++) for (let c = 0; c < 25; c++) {
      const isFinder = (r<8&&c<8)||(r<8&&c>16)||(r>16&&c<8)
      if (!isFinder) { ctx.fillStyle = rng()>.48 ? 'rgba(251,191,36,.82)' : '#020c06'; ctx.fillRect(c*cs+0.5, r*cs+0.5, cs-1, cs-1) }
    }
    finder(0,0); finder(0,18); finder(18,0)
  }, [qrOpen, id, card])

  function showToast(m: string) {
    setToast(m)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✓ কপি হয়েছে!'))
      .catch(() => {
        const ta = document.createElement('textarea')
        ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(ta); ta.select()
        document.execCommand('copy'); document.body.removeChild(ta)
        showToast('✓ কপি হয়েছে!')
      })
  }

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${id}`
    : `https://your-app.vercel.app/card/${id}`

  async function downloadCard() {
  if (!cardRef.current) return
  try {
    await document.fonts.ready
    await new Promise(r => setTimeout(r, 300))
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#120400',
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style')
        style.textContent = '* { animation: none !important; transition: none !important; }'
        clonedDoc.head.appendChild(style)
      }
    })
      const a = document.createElement('a')
      a.download = `eid-card-${id}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
      showToast('✓ ডাউনলোড হচ্ছে!')
    } catch {
      showToast('ডাউনলোড সম্ভব হয়নি')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#03090d,#050e08)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(251,191,36,.2)', borderTopColor:'#fbbf24', margin:'0 auto 16px', animation:'spin .7s linear infinite' }} />
        <p style={{ color:'rgba(251,191,36,.6)', fontSize:14 }}>লোড হচ্ছে...</p>
      </div>
    </div>
  )

  if (!card) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#03090d,#050e08)' }}>
      <div className="glass text-center" style={{ padding:'48px 40px', maxWidth:360, margin:'0 16px' }}>
        <p style={{ fontSize:52 }}>😢</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#fde68a', margin:'16px 0 8px' }}>কার্ড পাওয়া যায়নি</h2>
        <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.6, marginBottom:24 }}>
          This card does not exist or was made on a different device.
        </p>
        <button className="btn-gold" onClick={() => router.push('/')} style={{ padding:'12px 32px', borderRadius:14, fontSize:14 }}>
          নতুন কার্ড তৈরি করুন
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 15% 10%,#040f1a,transparent 70%), radial-gradient(ellipse 60% 80% at 85% 90%,#040f1a,transparent 70%), linear-gradient(180deg,#03090d 0%,#050e08 50%,#03090d 100%)'
      }}>
        <div className="absolute w-96 h-96 rounded-full -top-10 -left-10" style={{ background: 'rgba(5,20,10,.65)', filter: 'blur(90px)' }} />
        {STARS.map((s, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: s.w, height: s.w, left: `${s.l}%`, top: `${s.t}%`,
            background: s.gold ? '#fde68a' : '#a7f3d0', opacity: s.op,
            animation: `twinkle ${s.dur}s ease-in-out ${s.del}s infinite`,
          }} />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Nav bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <button className="glass btn-ghost" onClick={() => router.push('/')}
            style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, padding:'8px 14px', borderRadius:13 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            নতুন কার্ড
          </button>
          <div className="glass" style={{ fontSize:11, color:'rgba(255,255,255,.38)', padding:'6px 13px', borderRadius:11 }}>
            👁 {card.vc} বার দেখা হয়েছে
          </div>
        </div>

        {/* Page heading */}
        <div style={{ textAlign:'center', marginBottom:22 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.38)', marginBottom:7 }}>🎉 আপনি একটি বিশেষ ঈদ কার্ড পেয়েছেন!</p>
          <h2 className="gold-text" style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700 }}>ঈদ মোবারক</h2>
        </div>

        {/* The card */}
        <div ref={cardRef} style={{ borderRadius:22, overflow:'hidden', animation:'glow 4s ease-in-out infinite' }}>
          <CardCanvas card={card} />
        </div>

        {/* Salami section */}
        {card.salami && (card.bk || card.ng || card.up) && (
          <div className="glass" style={{ marginTop:16, overflow:'hidden' }}>
            <button onClick={() => setSalamiOpen(!salamiOpen)} style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'16px 20px', cursor:'pointer', border:'none', background:'transparent',
              fontFamily:"'Nunito',sans-serif",
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:26 }}>🎁</span>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontWeight:700, color:'#fde68a', fontSize:15 }}>সালামি পাঠান</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.37)' }}>Send Eid Salami to {card.sn}</div>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
                style={{ transition:'transform .3s', transform: salamiOpen ? 'rotate(180deg)' : '' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {salamiOpen && (
              <div style={{ padding:'0 16px 16px', borderTop:'1px solid rgba(255,255,255,.07)', animation:'rise .3s ease-out' }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.38)', textAlign:'center', margin:'14px 0' }}>
                  পেমেন্ট নম্বরে সালামি পাঠান
                </p>
                {[
                  { k:'bk', l:'bKash', c:'#f472b6', bg:'rgba(244,114,182,.07)', b:'rgba(244,114,182,.25)', v:card.bk },
                  { k:'ng', l:'Nagad', c:'#fb3c3c', bg:'rgba(251,146,60,.07)',   b:'rgba(251,146,60,.25)',  v:card.ng },
                  { k:'up', l:'Rocket',  c:'#a78bfa', bg:'rgba(167,139,250,.07)',  b:'rgba(167,139,250,.25)', v:card.up },
                ].filter(p => p.v).map(p => (
                  <div key={p.k} style={{ background:p.bg, border:`1px solid ${p.b}`, borderRadius:15, padding:'13px 16px', marginBottom:9, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <p style={{ fontSize:10, fontWeight:800, color:p.c }}>{p.l}</p>
                      <p style={{ fontFamily:'monospace', fontSize:19, fontWeight:700, letterSpacing:1.5, color:'#f0fdf4', marginTop:2 }}>{p.v}</p>
                    </div>
                    <button onClick={() => copyText(p.v)} style={{ padding:9, borderRadius:11, cursor:'pointer', border:'1px solid rgba(255,255,255,.14)', background:'rgba(255,255,255,.05)', transition:'all .3s' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.c} strokeWidth="2" strokeLinecap="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Share panel */}
        <div className="glass" style={{ marginTop:16, padding:22 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#fde68a', marginBottom:16, display:'flex', alignItems:'center', gap:9 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            শেয়ার করুন
          </div>

          {/* Copy link bar */}
          <div onClick={() => copyText(shareUrl)} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:14, padding:'11px 15px', cursor:'pointer', marginBottom:11, transition:'all .3s' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span style={{ fontSize:12, color:'rgba(255,255,255,.55)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{shareUrl}</span>
            <span style={{ fontSize:11, color:'rgba(251,191,36,.7)', flexShrink:0 }}>লিংক কপি করুন</span>
          </div>

          {/* Social share buttons */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10, marginBottom:12 }}>

            <button
              onClick={async () => {
                const shareData = {
                  title: "🌙 Eid Mubarak",
                  text: `🌙 ঈদ মোবারক! ${card.sn} আপনাকে একটি বিশেষ ঈদের কার্ড পাঠিয়েছেন। দেখুন:`,
                  url: shareUrl
                };

                try {
                  if (navigator.share) {
                    await navigator.share(shareData);
                  } else {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Link copied! এখন শেয়ার করুন 😊");
                  }
                } catch (err) {
                  console.log("Share cancelled or failed", err);
                }
              }}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:13, borderRadius:14, cursor:'pointer', fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700, background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.25)', color:'#4ade80', transition:'all .3s' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.13-4.15c.05-.23.09-.47.09-.7 0-.24-.03-.47-.09-.7l7.12-4.16c.54.5 1.25.81 2.01.81 1.66 0 3-1.34 3-3S19.66 2 18 2s-3 1.34-3 3c0 .24.03.47.09.7L7.97 9.86C7.43 9.36 6.72 9.05 6 9.05c-1.66 0-3 1.34-3 3s1.34 3 3 3c.72 0 1.43-.31 1.97-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92S21 20.61 21 19s-1.34-2.92-3-2.92z"/>
              </svg>

              ঈদ কার্ড শেয়ার করুন
            </button>



          </div>

          

          {/* Download */}
          <button className="btn-ghost" onClick={downloadCard} style={{ width:'100%', padding:13, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:13, fontWeight:700 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            কার্ড ডাউনলোড করুন · Download PNG
          </button>
        </div>

        {/* Create your own CTA */}
        <div style={{ textAlign:'center', marginTop:28 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.3)', marginBottom:12 }}>আপনিও একটি কার্ড বানান!</p>
          <button className="btn-gold" onClick={() => router.push('/')} style={{ padding:'13px 36px', borderRadius:14, fontSize:14 }}>
            🌙 নিজের জন্য তৈরি করুন
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
