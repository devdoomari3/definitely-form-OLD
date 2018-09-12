import {
  ParsedValueProperty,
  ValueProperty,
} from './ExtractType';
import { FormSpecBase } from './FormSpecBase';

export type FormDataParsed<
  FormSpec extends FormSpecBase,
> = {
  [key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>
};

export type FormData<
  FormSpec extends FormSpecBase
> = {
  [key in keyof FormSpec]: ValueProperty<FormSpec[key]>
};
