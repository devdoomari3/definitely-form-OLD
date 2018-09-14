import { FormSpecBase } from '../types/FormSpecBase';

export type MapFormSpec<FormSpec extends FormSpecBase, B> {

}


function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function map