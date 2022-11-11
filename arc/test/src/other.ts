import { LIB } from './lib'
import { _HIDDEN } from './_hidden'

export function other(): void {
  console.log('other', LIB, _HIDDEN)
}

export class Qweeee {
  constructor(public a: any) {}

  get A(): any {
    return { ...this.a, ...{ q: 1212 } }
  }
}
