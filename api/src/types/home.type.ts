export type HomeDetails = {
  id: string
  name: string
  members: { id: string; homeId: string; name: string }[]
  bills: {
    id: string
    homeId: string
    title: string
    totalCents: number
    shares: { id: string; memberId: string; amountCents: number; paidAt: string | null }[]
  }[]
}
