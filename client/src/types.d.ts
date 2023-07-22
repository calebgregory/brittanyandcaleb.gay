declare module '@app/App/sections/Accommodations/hotels.yml' {
  export type Hotel = {
    name: string
    url: string
    address: string
    distances: [string, string]
    cost: string
    comment?: string
  }

  type H = {
    introduction: string
    hotels: ReadonlyArray<Hotel>
  }

  declare const h: H

  export default h
}
