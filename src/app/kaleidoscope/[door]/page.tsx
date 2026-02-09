import { notFound } from "next/navigation"
import { doorMap } from "../_data"
import KaleidoscopeDoorPage from "../_components/KaleidoscopeDoorPage"

interface Props {
  params: Promise<{ door: string }>
}

export default async function DoorPage({ params }: Props) {
  const { door: slug } = await params
  const door = doorMap[slug]

  if (!door) {
    notFound()
  }

  return <KaleidoscopeDoorPage door={door} />
}
