export interface User {
  id: string
  name: string
  email: string
  password: string
}

export type Rarity = 'comum' | 'rara' | 'brilhante'

export interface Sticker {
  id: number
  name: string
  country: string
  photoUrl: string
  group: string
  collected: boolean
  rarity: Rarity
}

export interface AlbumSummary {
  total: number
  collected: number
  percentage: number
}

export type FilterType = 'all' | 'collected' | 'pending'