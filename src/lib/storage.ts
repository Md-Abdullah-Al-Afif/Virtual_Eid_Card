export interface CardData {
  id: string
  tpl: 'moonlight' | 'lantern' | 'geometric'
  sn: string       // sender name
  rn: string       // receiver name
  msg: string      // message
  sig: string      // signature
  salami: boolean
  bk: string       // bkash
  ng: string       // nagad
  up: string       // upay
  vc: number       // view count
  ts: number       // timestamp
}

export function saveCard(card: CardData): void {
  if (typeof window === 'undefined') return
  const store = getStore()
  store[card.id] = card
  localStorage.setItem('eid_cards', JSON.stringify(store))
}

export function getCard(id: string): CardData | null {
  if (typeof window === 'undefined') return null
  const store = getStore()
  return store[id] || null
}

export function incrementView(id: string): void {
  if (typeof window === 'undefined') return
  const store = getStore()
  if (store[id]) {
    store[id].vc = (store[id].vc || 0) + 1
    localStorage.setItem('eid_cards', JSON.stringify(store))
  }
}

function getStore(): Record<string, CardData> {
  try {
    const d = localStorage.getItem('eid_cards')
    return d ? JSON.parse(d) : {}
  } catch {
    return {}
  }
}
