/** The non-editor pages of the creator story: entry, the fork, checkout and the room. */
import { motion } from 'framer-motion'
import { Card, Cta, EffectHost, Nav, OptionRow, StatusPill, Table, TextInput, TopGradient, asset as A } from './components'
import { enter } from './motion'
import { MONTHS, ordinal } from './state'
import type { Action, State } from './state'

type P = { s: State; act: (a: Action) => void }
const E = (i: number) => ({ variants: enter, custom: i, initial: 'hidden' as const, animate: 'shown' as const })
const go = (act: P['act'], page: State['page']) => () => act({ type: 'go', page })

/* 01 · The campaign — an Instagram post; the ad's own button is the way in */
export function Campaign({ act }: P) {
  return (
    <>
      <p className="ig-title">Instagram</p>
      <img className="ig-heart" src={A('ig-heart.svg')} alt="" />
      <img className="ig-send" src={A('ig-polygon.svg')} alt="" />
      <motion.div className="layer" {...E(0)}>
        <div className="ig-post">
          <div className="ig-h">
            <div className="ig-id">
              <img className="ig-avatar" src={A('ig-avatar.png')} alt="" />
              <div className="ig-who"><b>loovly</b><span>Sponsored</span></div>
            </div>
            <span className="ig-more">···</span>
          </div>
          <div className="ig-media">
            <div className="ig-card">
              <img src={A('card-photo.jpg')} alt="" />
              <span className="ig-cap">Happy birthday</span>
              <span className="ig-pill ig-aa">Aa</span>
              <span className="ig-pill ig-pen">✎</span>
            </div>
            <p className="ig-from">from all of us</p>
          </div>
          <button className="ig-cta" onClick={go(act, 'landing')}><span>Learn more</span><span>›</span></button>
          <div className="ig-acts"><img src={A('ig-acts.svg')} alt="" /><span className="ig-bookmark" /></div>
          <div className="ig-meta">
            <p className="ig-likes">2,184 likes</p>
            <p className="ig-text"><b>loovly</b> Everyone who loves them, in one card. Make one — it takes about five minutes.</p>
            <p className="ig-comments">View all 214 comments</p>
          </div>
        </div>
      </motion.div>
      <p className="ig-hint">tap Learn more — it is the ad’s own button</p>
    </>
  )
}

/* 02 · The landing */
export function Landing({ act }: P) {
  return (
    <>
      <TopGradient />
      <Nav />
      <motion.h1 className="land-title" {...E(0)}>Everyone who loves<br />them, in one card</motion.h1>
      <motion.div className="layer" {...E(1)}><Card src="card-cat.jpg" top={174} onPencil={go(act, 'create')} /></motion.div>
      <motion.p className="land-from" {...E(1)}>from all of us</motion.p>
      <motion.p className="land-tags" {...E(2)}>birthdays · weddings · new babies · send-offs · just because</motion.p>
      <motion.p className="land-body" {...E(3)}>You pick who it is for and what to ask. Everyone who loves them sends one thing. It arrives on the day as one card.</motion.p>
      <motion.div className="layer" {...E(4)}><Cta top={765} onClick={go(act, 'create')}>Make one</Cta></motion.div>
    </>
  )
}

/* 07 · Digital, or the Card */
export function Fork({ s, act }: P) {
  const pick = (delivery: 'card' | 'digital') => () => act({ type: 'setDelivery', delivery })
  return (
    <>
      <TopGradient />
      <Nav />
      <motion.h1 className="page-title" style={{ top: 170 }} {...E(0)}>Digital, or the Card</motion.h1>
      <motion.div className="layer" {...E(1)}>
        <button className={'fork-card' + (s.delivery === 'card' ? ' selected' : '')} style={{ left: 24 }} onClick={pick('card')} aria-pressed={s.delivery === 'card'}>
          <span className="fork-device" style={{ left: 18, width: 128 }}><img src={A('card-photo.jpg')} alt="" style={{ left: 11, top: 15, width: 106, height: 58 }} /></span>
          <span className="fork-name">The Loovly Card</span>
          <span className="fork-price">$100</span>
          <span className="fork-desc">a real card with a screen</span>
        </button>
      </motion.div>
      <motion.div className="layer" {...E(2)}>
        <button className={'fork-card' + (s.delivery === 'digital' ? ' selected' : '')} style={{ left: 199 }} onClick={pick('digital')} aria-pressed={s.delivery === 'digital'}>
          <span className="fork-device" style={{ left: 52, width: 60 }}><img src={A('card-photo.jpg')} alt="" style={{ left: 9, top: 14, width: 42, height: 58 }} /></span>
          <span className="fork-name">Digital only</span>
          <span className="fork-price">free</span>
          <span className="fork-desc">opens right on time</span>
        </button>
      </motion.div>
      <motion.div className="layer" {...E(3)}><Cta top={765} onClick={go(act, 'account')}>Continue</Cta></motion.div>
    </>
  )
}

/* 08 · Create account */
export function Account({ s, act }: P) {
  const next = go(act, s.delivery === 'digital' ? 'room' : 'where')
  return (
    <>
      <TopGradient />
      <Nav />
      <motion.h1 className="page-title" style={{ top: 230, width: 340, left: 25 }} {...E(0)}>Create your account.</motion.h1>
      <motion.p className="account-body" {...E(1)}>This is what keeps the card yours. It is also the only way back in to run the room.</motion.p>
      <motion.div className="layer" {...E(2)}>
        <TextInput className="account-input" value={s.firstName} onChange={(firstName) => act({ type: 'setFirstName', firstName })} placeholder="first name is fine" onSubmit={next} />
        <span className="account-rule" />
      </motion.div>
      <motion.div className="layer" {...E(3)}><Cta top={753} left={95} width={200} onClick={next}>Text me a code</Cta></motion.div>
    </>
  )
}

/* 09 · Where it goes */
export function Where({ s, act }: P) {
  const pick = (destination: 'them' | 'me' | 'quiet') => () => act({ type: 'setDestination', destination })
  const them = s.name || 'them'
  return (
    <>
      <Nav />
      <motion.h1 className="page-title" style={{ top: 194 }} {...E(0)}>Where does their card go?</motion.h1>
      <motion.div className="layer" {...E(1)}><OptionRow top={287} title="To them" desc={`${them}’s address, straight to their door`} selected={s.destination === 'them'} onClick={pick('them')} /></motion.div>
      <motion.div className="layer" {...E(2)}><OptionRow top={379} title="To me first" desc="you hand it over yourself, nothing spoiled" selected={s.destination === 'me'} onClick={pick('me')} /></motion.div>
      <motion.div className="layer" {...E(3)}><OptionRow top={471} height={102} title="We ask them quietly" desc="no address? we get it without giving anything away" selected={s.destination === 'quiet'} onClick={pick('quiet')} /></motion.div>
      <motion.div className="layer" {...E(4)}><Cta top={765} width={200} onClick={() => { if (!s.destination) act({ type: 'setDestination', destination: 'them' }); act({ type: 'go', page: 'pay' }) }}>Continue</Cta></motion.div>
    </>
  )
}

/* 10 · Pay */
export function Pay({ s, act }: P) {
  const day = s.day ?? 10
  return (
    <>
      <Nav />
      <motion.h1 className="page-title" style={{ top: 236 }} {...E(0)}>Pay</motion.h1>
      <motion.div className="layer" {...E(1)}><Table top={337} height={108} rows={[['The Loovly Card', '$100.00'], ['Shipping', 'free']]} /></motion.div>
      <motion.p className="pay-note" {...E(2)}>it prints and posts in 8 days — it reaches {s.name || 'them'} for the {ordinal(day)}</motion.p>
      <motion.div className="layer" {...E(3)}><Cta top={765} onClick={go(act, 'sent')}>Pay with Apple Pay</Cta></motion.div>
    </>
  )
}

/* 11 · It's on its way */
export function Sent({ s, act }: P) {
  const when = s.day === null ? 'on the day' : `${s.day} ${MONTHS[s.month]}`
  return (
    <>
      <Nav />
      <motion.h1 className="page-title" style={{ top: 219 }} {...E(0)}>It’s on its way</motion.h1>
      <motion.div className="layer" {...E(1)}><Table top={321} height={162} rows={[['The Loovly Card', 'paid'], ['Prints and posts', '8 days'], [`Reaches ${s.name || 'them'}`, when]]} /></motion.div>
      <motion.p className="sent-body" {...E(2)}>A real card with a screen in it, posted to their address. It plays whatever the room has in it by the time it seals.</motion.p>
      <motion.div className="layer" {...E(3)}><Cta top={765} onClick={go(act, 'room')}>Start asking people</Cta></motion.div>
    </>
  )
}

/* 13 · The room, empty — the end of the creator story */
export function Room({ s, act }: P) {
  return (
    <>
      <Nav />
      <motion.h1 className="room-title" {...E(0)}>Invites are out</motion.h1>
      <motion.div className="layer" {...E(1)}>
        <div className="room-card">
          <img src={A(s.card)} alt="" />
          {s.text && <span className="room-cap" style={{ color: s.color }}>{s.text.toLowerCase()}</span>}
        </div>
        <StatusPill label="LOCKED" x={139} y={183} />
      </motion.div>
      <EffectHost effect={s.effect} card={{ left: 76, top: 167, width: 238, height: 317 }} />
      <motion.div className="layer" {...E(1)}>
        <button className="card-pencil room-pencil" onClick={go(act, 'create')} aria-label="Edit card">
          <img src={A('card-pencil-bg.svg')} alt="" style={{ left: 0, top: 0, width: 40, height: 40 }} />
          <img src={A('card-pencil.svg')} alt="" style={{ left: 0.32, top: 0, width: 39.04, height: 39.04 }} />
        </button>
      </motion.div>
      <motion.div className="layer" {...E(2)}>
        <div className="ghost-post">
          <span className="ghost-avatar">+</span>
          <span className="ghost-add">Add yours</span>
          <span className="ghost-now">NOW</span>
          <span className="ghost-line" />
          <span className="ghost-plus">+</span>
          <p className="ghost-copy">your photo and your line land here<br />— someone has to go first</p>
        </div>
      </motion.div>
      <motion.div className="layer" {...E(3)}>
        <div className="room-bar">
          <button className="room-tab" style={{ left: 27 }}><span className="room-ico">◍</span><span>MANAGE</span></button>
          <span className="room-count">0</span>
          <button className="room-tab" style={{ left: 231 }}><span className="room-ico">+</span><span>INVITE</span></button>
        </div>
      </motion.div>
    </>
  )
}
