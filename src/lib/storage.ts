import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

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
  const snap = await getDoc(doc(db, 'cards', id))
  if (!snap.exists()) return null
  return snap.data() as CardData
}

export async function incrementView(id: string): Promise<void> {
  await updateDoc(doc(db, 'cards', id), { vc: increment(1) })
}