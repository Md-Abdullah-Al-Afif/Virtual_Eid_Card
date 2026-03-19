import CardView from './CardView'

export default function CardPage({ params }: { params: { id: string } }) {
  return <CardView id={params.id} />
}
