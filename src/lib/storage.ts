import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore'

export interface CardData {
  id: string
  tpl: 'moonlight' | 'lantern' | 'geometric'
  sn: string
  rn: string
  msg: string
  sig: string
  salami: boolean
  bk: string
  ng: string
  up: string
  vc: number
  ts: number
}

export async function createCard(card: CardData): Promise<void> {
  await setDoc(doc(db, 'cards', card.id), card)
}

export async function getCard(id: string): Promise<CardData | null> {
  try {
    const snap = await getDoc(doc(db, 'cards', id))
    if (!snap.exists()) return null
    return snap.data() as CardData
  } catch (err) {
    console.error('getCard error:', err)
    return null
  }
}

export function incrementView(id: string): void {
  updateDoc(doc(db, 'cards', id), { vc: increment(1) }).catch(() => {})
}