'use client'
import { useState, useEffect, useRef } from 'react'
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
      id: genId(), tpl, sn: sn.trim(), rn: rn.trim(),
      msg: msg.trim(), sig: sig.trim(), salami,
      bk: bk.trim(), ng: ng.trim(), up: up.trim(),
      vc: 0, ts: Date.now(),
    }
    await createCard(card)
    router.push(`/card/${card.id}`)
  }

  const preview: CardData = { id: 'prev', tpl, sn: sn || 'আপনার নাম', rn, msg: msg || 'ঈদ মোবারক...', sig: sig || 'স্বাক্ষর', salami, bk, ng, up, vc: 0, ts: 0 }

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 15% 10%,#040f1a,transparent 70%), radial-gradient(ellipse 60% 80% at 85% 90%,#040f1a,transparent 70%), linear-gradient(180deg,#03090d 0%,#050e08 50%,#03090d 100%)'
      }}>
        <div className="absolute w-[550px] h-[550px] rounded-full -top-10 -left-10" style={{ background: 'rgba(5,20,10,.65)', filter: 'blur(90px)' }} />
        <div className="absolute w-[450px] h-[350px] rounded-full bottom-10 -right-10" style={{ background: 'rgba(4,10,24,.65)', filter: 'blur(90px)' }} />
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

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center pt-14 pb-10 px-4">
          <div className="inline-flex items-center gap-2 glass text-xs px-5 py-2 rounded-full mb-6" style={{ color: 'rgba(251,191,36,.8)' }}>
            🌙 &nbsp;ঈদ মোবারক &nbsp;✦&nbsp; Eid Mubarak ✨
          </div>
          <h1 className="text-7xl font-black leading-tight">
            <span className="gold-text">ঈদ কার্ড</span>
          </h1>
          <p className="mt-3 text-lg font-medium" style={{ color: 'rgba(52,211,153,.7)' }}>প্রিয়জনদের জন্য বিশেষ ঈদ কার্ড তৈরি করুন</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.3)' }}>Create &amp; share beautiful virtual Eid cards</p>
        </header>

        <main className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── LEFT FORM ── */}
            <div className="space-y-4">

              {/* Template */}
              <div className="glass p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display',serif", color: '#fde68a' }}>
                  ✦ টেমপ্লেট বেছে নিন
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'moonlight', label: '🌙 চাঁদনী রাত', sub: 'Moonlit Night', bg: 'linear-gradient(170deg,#04091e,#080e28,#04130a)' },
                    { id: 'lantern',   label: '🏮 সোনালি লণ্ঠন', sub: 'Golden Lantern', bg: 'linear-gradient(170deg,#180800,#2a1000,#160600)' },
                    { id: 'geometric', label: '✦ ইসলামিক জ্যামিতি', sub: 'Islamic Geometric', bg: 'linear-gradient(170deg,#021a10,#053d28,#021a10)' },
                  ] as const).map(t => (
                    <button key={t.id} onClick={() => setTpl(t.id)}
                      className="rounded-2xl overflow-hidden transition-all duration-300 relative"
                      style={{
                        border: tpl === t.id ? '2px solid #fbbf24' : '1.5px solid rgba(255,255,255,.1)',
                        boxShadow: tpl === t.id ? '0 0 24px rgba(251,191,36,.35)' : 'none',
                        transform: tpl === t.id ? 'scale(1.06)' : 'scale(1)',
                      }}>
                      <div className="h-20 flex items-center justify-center" style={{ background: t.bg }}>
                        <TplThumb id={t.id} />
                      </div>
                      <div className="py-2 px-1 text-center" style={{ background: 'rgba(0,0,0,.5)' }}>
                        <p className="text-xs font-bold" style={{ color: '#fde68a' }}>{t.label}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,.38)', fontSize: 9 }}>{t.sub}</p>
                      </div>
                      {tpl === t.id && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#fbbf24' }}>
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              <div className="glass p-6 space-y-4">
                <h2 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display',serif", color: '#fde68a' }}>✉ কার্ডের তথ্য</h2>
                <Field label="প্রেরকের নাম *" sub="Sender Name">
                  <input className="inp" placeholder="আপনার নাম লিখুন" value={sn} onChange={e => setSn(e.target.value)} />
                  {errors.sn && <Err>{errors.sn}</Err>}
                </Field>
                <Field label="প্রাপকের নাম" sub="Receiver — Optional">
                  <input className="inp" placeholder="যাকে পাঠাবেন তার নাম" value={rn} onChange={e => setRn(e.target.value)} />
                </Field>
                <Field label="বার্তা *" sub="Message">
                  <textarea className="inp" rows={4} style={{ resize: 'vertical', lineHeight: 1.6 }} placeholder="ঈদের শুভেচ্ছা বার্তা..." value={msg} onChange={e => setMsg(e.target.value)} />
                  {errors.msg && <Err>{errors.msg}</Err>}
                </Field>
                <Field label="স্বাক্ষর *" sub="Signature">
                  <input className="inp" placeholder="আপনার নাম বা ডাকনাম" value={sig} onChange={e => setSig(e.target.value)} />
                  {errors.sig && <Err>{errors.sig}</Err>}
                </Field>
              </div>

              {/* Salami */}
              <div className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold" style={{ fontFamily: "'Playfair Display',serif", color: '#fde68a' }}>🎁 সালামি রিকোয়েস্ট</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.33)' }}>Eid Salami Request</p>
                  </div>
                  <button className={`tog ${salami ? 'on' : ''}`} onClick={() => setSalami(!salami)}>
                    <div className="tog-k" />
                  </button>
                </div>
                {salami && (
                  <div className="mt-5 space-y-3 animate-rise">
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,.38)' }}>অ্যাকাউন্ট নম্বর দিন (কমপক্ষে একটি)</p>
                    {[
                      { label: 'bKash', color: '#f472b6', val: bk, set: setBk },
                      { label: 'Nagad', color: '#fb3c3c', val: ng, set: setNg },
                      { label: 'Rocket',  color: '#a78bfa', val: up, set: setUp },
                    ].map(p => (
                      <div key={p.label} className="flex items-center gap-3">
                        <span className="text-xs font-black w-11 text-right flex-shrink-0" style={{ color: p.color }}>{p.label}</span>
                        <input className="inp" type="tel" placeholder="01XXXXXXXXX" value={p.val} onChange={e => p.set(e.target.value)} />
                      </div>
                    ))}
                    {errors.sal && <Err>{errors.sal}</Err>}
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button className="btn-gold w-full py-5 rounded-2xl text-lg flex items-center justify-center gap-3" onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <><div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black/70" style={{ animation: 'spin .65s linear infinite' }} /> তৈরি হচ্ছে...</>
                ) : (
                  <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg> কার্ড তৈরি করুন · Generate Card</>
                )}
              </button>
            </div>

            {/* ── RIGHT PREVIEW ── */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="glass p-6">
                <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "'Playfair Display',serif", color: '#fde68a' }}>🌙 লাইভ প্রিভিউ</h2>
                <div className="rounded-2xl overflow-hidden animate-glow">
                  <CardCanvas card={preview} />
                </div>
              </div>
            </div>

          </div>
        </main>
        <footer style={{
          textAlign: 'center',
          padding: '24px 16px',
          fontSize: 13,
          color: 'rgba(255,255,255,.3)',
          borderTop: '1px solid rgba(251,191,36,.08)',
          marginTop: 8,
        }}>
          Made with <span style={{ color: '#f472b6', fontSize: 15 }}>💓</span> by{' '}
          <span style={{
            background: 'linear-gradient(135deg,#fde68a,#fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
          }}>
            Afif
          </span>
        </footer>

      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}

function Field({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(52,211,153,.85)' }}>
        {label} {sub && <span style={{ color: 'rgba(255,255,255,.3)' }}>({sub})</span>}
      </label>
      {children}
    </div>
  )
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="text-xs mt-1" style={{ color: '#f87171' }}>{children}</p>
}

function TplThumb({ id }: { id: string }) {
  if (id === 'moonlight') return (
    <svg width="72" height="60" viewBox="0 0 72 60" fill="none">
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
    <svg width="72" height="62" viewBox="0 0 72 62" fill="none">
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
    <svg width="72" height="62" viewBox="0 0 72 62" fill="none">
      <circle cx="36" cy="31" r="28" stroke="rgba(110,231,183,.15)" strokeWidth="1" />
      <circle cx="36" cy="31" r="22" stroke="rgba(110,231,183,.1)" strokeWidth=".8" strokeDasharray="3 5" />
      <polygon points="36,6 41,20 56,20 44,29 49,43 36,35 23,43 28,29 16,20 31,20" stroke="#6ee7b7" strokeWidth="1.3" fill="none" />
      <polygon points="36,14 40,24 52,24 43,31 47,41 36,35 25,41 29,31 20,24 32,24" fill="rgba(110,231,183,.14)" stroke="#34d399" strokeWidth=".9" />
      <circle cx="36" cy="31" r="5.5" fill="rgba(110,231,183,.25)" stroke="#6ee7b7" strokeWidth="1" />
    </svg>
  )
}
