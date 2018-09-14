import {
  FormSpecBase,
} from './FormSpecBase';

export type EventHandler<
  FormSpec extends FormSpecBase,
  fieldName extends keyof FormSpec,
  value extends FormSpec[fieldName]
> = {
  onBlur(): void;
  onFocus(): void;
  onChange(value: value): void;
};

export type EventHandlers<
  FormSpec extends FormSpecBase
> = {
  [key in keyof FormSpec]: EventHandler<FormSpec, key, FormSpec[key]>;
};
