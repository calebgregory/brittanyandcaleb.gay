/** See https://stackoverflow.com/a/51390763/1470607  */
type Falsy = false | 0 | '' | null | undefined

interface Array<T> {
  filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): Exclude<S, Falsy>[]
}
