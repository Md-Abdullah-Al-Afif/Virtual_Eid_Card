'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CardData, createCard } from '@/lib/storage'
import CardCanvas from './CardCanvas'

function genId() {
  return Math.random().toString(36).slice(2, 10)
}

const STARS = Array.from({ length: 90 }, (_, i) => ({
  w: 0.8 + ((i * 7919) % 26) / 10,
  l: ((i * 6271) % 1000) / 10,
  t: ((i * 3571) % 600) / 10,
  gold: i % 3 === 0,
  dur: 1.6 + ((i * 1009) % 35) / 10,
  del: ((i * 2503) % 25) / 10,
  op: 0.25 + ((i * 1301) % 75) / 100,
}))

const TEMPLATES = [
  { id: 'moonlight' as const, label: '🌙 চাঁদনী রাত', sub: 'Moonlit Night',     bg: 'linear-gradient(170deg,#04091e,#080e28,#04130a)' },
  { id: 'lantern'   as const, label: '🏮 সোনালি লণ্ঠন', sub: 'Golden Lantern',   bg: 'linear-gradient(170deg,#180800,#2a1000,#160600)' },
  { id: 'geometric' as const, label: '✦ জ্যামিতি',     sub: 'Islamic Geometric', bg: 'linear-gradient(170deg,#021a10,#053d28,#021a10)' },
]

export default function HomePage() {
  const router = useRouter()
  const [tpl, setTpl] = useState<'moonlight' | 'lantern' | 'geometric'>('moonlight')
  const [sn, setSn] = useState('')
  const [rn, setRn] = useState('')
  const [msg, setMsg] = useState('আপনাকে এবং আপনার পরিবারকে জানাই ঈদ মোবারক । আল্লাহ আপনার জীবন সুখ, শান্তি ও বরকতে পূর্ণ করুন।')
  const [sig, setSig] = useState('')
  const [salami, setSalami] = useState(false)
  const [bk, setBk] = useState('')
  const [ng, setNg] = useState('')
  const [up, setUp] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(m: string) {
    setToast(m)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!sn.trim()) e.sn = 'নাম দিন'
    if (!msg.trim()) e.msg = 'বার্তা লিখুন'
    if (!sig.trim()) e.sig = 'স্বাক্ষর দিন'
    if (salami && !bk && !ng && !up) e.sal = 'কমপক্ষে একটি নম্বর দিন'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleGenerate() {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const card: CardData = {
      id: genId(), tpl,
      sn: sn.trim(), rn: rn.trim(),
      msg: msg.trim(), sig: sig.trim(),
      salami,
      bk: bk.trim(), ng: ng.trim(), up: up.trim(),
      vc: 0, ts: Date.now(),
    }
    await createCard(card)
    router.push(`/card/${card.id}`)
  }

  const preview: CardData = {
    id: 'prev', tpl,
    sn: sn || 'আপনার নাম', rn,
    msg: msg || 'ঈদ মোবারক...',
    sig: sig || 'স্বাক্ষর',
    salami, bk, ng, up, vc: 0, ts: 0,
  }

  return (
    <>
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 15% 10%,#040f1a,transparent 70%), radial-gradient(ellipse 60% 80% at 85% 90%,#040f1a,transparent 70%), linear-gradient(180deg,#03090d 0%,#050e08 50%,#03090d 100%)'
      }}>
        <div className="absolute rounded-full -top-10 -left-10" style={{ width: 'min(550px, 80vw)', height: 'min(550px, 80vw)', background: 'rgba(5,20,10,.65)', filter: 'blur(90px)' }} />
        <div className="absolute rounded-full bottom-10 -right-10" style={{ width: 'min(450px, 70vw)', height: 'min(350px, 55vw)', background: 'rgba(4,10,24,.65)', filter: 'blur(90px)' }} />
        {STARS.map((s, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: s.w, height: s.w,
            left: `${s.l}%`, top: `${s.t}%`,
            background: s.gold ? '#fde68a' : '#a7f3d0',
            opacity: s.op,
            animation: `twinkle ${s.dur}s ease-in-out ${s.del}s infinite`,
          }} />
        ))}
      </div>

      {/* PAGE */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', overflowX: 'hidden' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '52px 16px 36px' }}>
          <div className="glass" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(251,191,36,.8)',
            padding: '6px 18px', borderRadius: 99,
            width: 'fit-content', margin: '0 auto 20px',
          }}>
            🌙 &nbsp;ঈদ মোবারক &nbsp;✦&nbsp; Eid Mubarak ✨
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 10vw, 72px)', fontWeight: 900, lineHeight: 1.1 }}>
            <span className="gold-text">ঈদ কার্ড</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 16, fontWeight: 500, color: 'rgba(52,211,153,.7)' }}>
            প্রিয়জনদের জন্য বিশেষ ঈদ কার্ড তৈরি করুন
          </p>
          <p style={{ fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,.3)' }}>
            Create &amp; share beautiful virtual Eid cards
          </p>
        </header>

        {/* MAIN */}
        <main style={{ width: '100%', padding: '0 16px 96px', boxSizing: 'border-box' }}>
          <div className="eid-grid">

            {/* LEFT FORM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

              {/* Template */}
              <div className="glass" style={{ padding: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: '#fde68a', marginBottom: 14 }}>
                  ✦ টেমপ্লেট বেছে নিন
                </h2>
                <div className="tpl-grid">
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setTpl(t.id)} style={{
                      borderRadius: 14, overflow: 'hidden',
                      border: tpl === t.id ? '2px solid #fbbf24' : '1.5px solid rgba(255,255,255,.1)',
                      boxShadow: tpl === t.id ? '0 0 20px rgba(251,191,36,.3)' : 'none',
                      background: 'none', cursor: 'pointer', padding: 0,
                      width: '100%', minWidth: 0, position: 'relative',
                    }}>
                      <div style={{ background: t.bg, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <TplThumb id={t.id} />
                      </div>
                      <div style={{ background: 'rgba(0,0,0,.55)', padding: '6px 4px', textAlign: 'center' }}>
                        <p style={{ color: '#fde68a', fontSize: 10, fontWeight: 700, lineHeight: 1.3, wordBreak: 'keep-all' }}>{t.label}</p>
                        <p style={{ color: 'rgba(255,255,255,.38)', fontSize: 9 }}>{t.sub}</p>
                      </div>
                      {tpl === t.id && (
                        <div style={{ position: 'absolute', top: 5, right: 5, width: 18, height: 18, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card details */}
              <div className="glass" style={{ padding: 22 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: '#fde68a', marginBottom: 16 }}>✉ কার্ডের তথ্য</h2>
                <Field label="প্রেরকের নাম *" sub="Sender Name">
                  <input className="inp" placeholder="আপনার নাম লিখুন" value={sn} onChange={e => setSn(e.target.value)} />
                  {errors.sn && <Err>{errors.sn}</Err>}
                </Field>
                <div style={{ marginTop: 14 }}>
                  <Field label="প্রাপকের নাম" sub="Receiver — Optional">
                    <input className="inp" placeholder="যাকে পাঠাবেন তার নাম" value={rn} onChange={e => setRn(e.target.value)} />
                  </Field>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Field label="বার্তা *" sub="Message">
                    <textarea className="inp" rows={4} placeholder="ঈদের শুভেচ্ছা বার্তা..." value={msg} onChange={e => setMsg(e.target.value)} />
                    {errors.msg && <Err>{errors.msg}</Err>}
                  </Field>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Field label="স্বাক্ষর *" sub="Signature">
                    <input className="inp" placeholder="আপনার নাম বা ডাকনাম" value={sig} onChange={e => setSig(e.target.value)} />
                    {errors.sig && <Err>{errors.sig}</Err>}
                  </Field>
                </div>
              </div>

              {/* Salami */}
              <div className="glass" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#fde68a', fontWeight: 700 }}>🎁 সালামি রিকোয়েস্ট</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,.33)', marginTop: 3 }}>Eid Salami Request</p>
                  </div>
                  <button className={`tog ${salami ? 'on' : ''}`} onClick={() => setSalami(!salami)}><div className="tog-k" /></button>
                </div>
                {salami && (
                  <div style={{ marginTop: 18 }} className="animate-rise">
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', marginBottom: 12 }}>অ্যাকাউন্ট নম্বর দিন (কমপক্ষে একটি)</p>
                    {[
                      { label: 'bKash',  color: '#f472b6', val: bk, set: setBk },
                      { label: 'Nagad',  color: '#fb3c3c', val: ng, set: setNg },
                      { label: 'Rocket', color: '#a78bfa', val: up, set: setUp },
                    ].map(p => (
                      <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, width: 44, textAlign: 'right', flexShrink: 0, color: p.color }}>{p.label}</span>
                        <input className="inp" type="tel" placeholder="01XXXXXXXXX" value={p.val} onChange={e => p.set(e.target.value)} />
                      </div>
                    ))}
                    {errors.sal && <Err>{errors.sal}</Err>}
                  </div>
                )}
              </div>

              {/* Generate */}
              <button className="btn-gold" onClick={handleGenerate} disabled={loading}
                style={{ width: '100%', padding: '18px 0', borderRadius: 18, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {loading ? (
                  <><div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(0,0,0,.2)', borderTopColor: 'rgba(0,0,0,.7)', animation: 'spin .65s linear infinite' }} />তৈরি হচ্ছে...</>
                ) : (
                  <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>কার্ড তৈরি করুন · Generate Card</>
                )}
              </button>
            </div>

            {/* RIGHT PREVIEW */}
            <div className="eid-preview-col">
              <div className="glass" style={{ padding: 22 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: '#fde68a', marginBottom: 16 }}>🌙 লাইভ প্রিভিউ</h2>
                <div style={{ borderRadius: 20, overflow: 'hidden' }} className="animate-glow">
                  <CardCanvas card={preview} />
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '24px 16px', fontSize: 13, color: 'rgba(255,255,255,.3)', borderTop: '1px solid rgba(251,191,36,.08)', marginTop: 8 }}>
          Made with <span style={{ color: '#f472b6', fontSize: 15 }}>💓</span> by{' '}
          <span style={{ background: 'linear-gradient(135deg,#fde68a,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>Afif</span>
        </footer>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}

function Field({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(52,211,153,.85)', marginBottom: 7 }}>
        {label} {sub && <span style={{ color: 'rgba(255,255,255,.3)' }}>({sub})</span>}
      </label>
      {children}
    </div>
  )
}

function Err({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11.5, marginTop: 5, color: '#f87171' }}>{children}</p>
}

function TplThumb({ id }: { id: string }) {
  if (id === 'moonlight') return (
    <svg viewBox="0 0 72 60" fill="none" style={{ width: '55%', height: 'auto' }}>
      <circle cx="36" cy="28" r="20" fill="rgba(253,230,138,.05)" />
      <circle cx="36" cy="28" r="15" fill="#fde68a" />
      <circle cx="44" cy="24" r="13" fill="#07102a" />
      <circle cx="27" cy="24" r="1.5" fill="rgba(200,150,20,.4)" />
      <circle cx="25" cy="31" r="1" fill="rgba(200,150,20,.35)" />
      {[[8,8,'#fde68a',.8],[62,7,'#a7f3d0',.8],[14,50,'#fde68a',.6],[58,52,'#a7f3d0',.7],[66,35,'#fde68a',.5],[4,40,'#a7f3d0',.6]].map(([x,y,c,o],i) => (
        <circle key={i} cx={x as number} cy={y as number} r="1" fill={c as string} opacity={o as number} />
      ))}
    </svg>
  )
  if (id === 'lantern') return (
    <svg viewBox="0 0 72 62" fill="none" style={{ width: '55%', height: 'auto' }}>
      {[22, 50].map(cx => (
        <g key={cx}>
          <line x1={cx} y1="0" x2={cx} y2="10" stroke="rgba(251,191,36,.5)" strokeWidth="1" />
          <ellipse cx={cx} cy="10" rx="9" ry="3.5" stroke="#fbbf24" strokeWidth="1" fill="rgba(180,100,0,.4)" />
          <path d={`M${cx-9} 10 Q${cx-11} 8 ${cx} 8 Q${cx+11} 8 ${cx+9} 10 L${cx+9} 46 Q${cx+11} 48 ${cx} 48 Q${cx-11} 48 ${cx-9} 46 Z`} fill="rgba(251,150,36,.1)" stroke="#fbbf24" strokeWidth="1.1" />
          <ellipse cx={cx} cy="46" rx="9" ry="3.5" stroke="#fbbf24" strokeWidth="1" fill="rgba(180,100,0,.4)" />
          <ellipse cx={cx} cy="28" rx="5.5" ry="8" fill="rgba(251,191,36,.25)" />
          <ellipse cx={cx} cy="28" rx="2.5" ry="4" fill="rgba(253,230,138,.2)" />
        </g>
      ))}
    </svg>
  )
  return (
    <svg viewBox="0 0 72 62" fill="none" style={{ width: '55%', height: 'auto' }}>
      <circle cx="36" cy="31" r="28" stroke="rgba(110,231,183,.15)" strokeWidth="1" />
      <circle cx="36" cy="31" r="22" stroke="rgba(110,231,183,.1)" strokeWidth=".8" strokeDasharray="3 5" />
      <polygon points="36,6 41,20 56,20 44,29 49,43 36,35 23,43 28,29 16,20 31,20" stroke="#6ee7b7" strokeWidth="1.3" fill="none" />
      <polygon points="36,14 40,24 52,24 43,31 47,41 36,35 25,41 29,31 20,24 32,24" fill="rgba(110,231,183,.14)" stroke="#34d399" strokeWidth=".9" />
      <circle cx="36" cy="31" r="5.5" fill="rgba(110,231,183,.25)" stroke="#6ee7b7" strokeWidth="1" />
    </svg>
  )
}