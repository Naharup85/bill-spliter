export type PaymentResult =
  | {
      status: 200
      share: {
        id: string
        memberId: string
        amountCents: number
        paidAt: string
      }
    }
  | { status: 404 }
  | { status: 409 }
