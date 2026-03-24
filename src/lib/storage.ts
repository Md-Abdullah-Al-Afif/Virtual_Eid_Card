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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
}

export async function createCard(card: CardData): Promise<void> {
  await withTimeout(setDoc(doc(db, 'cards', card.id), card), 10000)
}

export async function getCard(id: string): Promise<CardData | null> {
  try {
    const snap = await withTimeout(getDoc(doc(db, 'cards', id)), 10000)
    if (!snap.exists()) return null
    return snap.data() as CardData
  } catch (err) {
    console.error('getCard failed:', err)
    return null
  }
}

export function incrementView(id: string): void {
  updateDoc(doc(db, 'cards', id), { vc: increment(1) }).catch((err) =>
    console.warn('incrementView failed (non-critical):', err)
  )
}