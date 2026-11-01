const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export type Home = {
  id: string
  name: string
}

export type Member = {
  id: string
  homeId: string
  name: string
}

export type Share = {
  id: string
  memberId: string
  amountCents: number
  paidAt: string | null
}

export type Bill = {
  id: string
  homeId: string
  title: string
  totalCents: number
  shares: Share[]
}

export type Balance = {
  memberId: string
  name: string
  outstandingCents: number
}

export type HomeDetails = Home & {
  members: Member[]
  bills: Bill[]
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error((data as { error?: string }).error || 'Something went wrong')
  }

  return data as T
}

export const api = {
  createHome(name: string) {
    return request<Home>('/api/homes', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },

  getHome(homeId: string) {
    return request<HomeDetails>(`/api/homes/${homeId}`)
  },

  addMember(homeId: string, name: string) {
    return request<Member>(`/api/homes/${homeId}/members`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },

  createBill(homeId: string, title: string, totalCents: number) {
    return request<Bill>(`/api/homes/${homeId}/bills`, {
      method: 'POST',
      body: JSON.stringify({ title, totalCents }),
    })
  },

  getBalances(homeId: string) {
    return request<{ balances: Balance[] }>(`/api/homes/${homeId}/balances`)
  },

  payShare(billId: string, shareId: string, idempotencyKey: string) {
    return request<Share>(`/api/bills/${billId}/shares/${shareId}/pay`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    })
  },
}
