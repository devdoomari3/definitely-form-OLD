import { mapObjIndexed } from 'ramda';
import {
  FocusEventHandler,
} from 'react';
import { Observable } from 'rxjs/observable';
import {
  BaseErrorValuesType,
  DefaultErrorValuesType,
} from './types/ErrorValueType';
import {
  ParsedValueProperty,
  ValueProperty,
} from './types/ExtractType';
import { FormSpecBase } from './types/FormSpecBase';
import { MaybePromise } from './types/MaybePromise';

export class MobxStateManager <
  FormSpec extends FormSpecBase,
  FormData = {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > },
  FormDataParsed = {[key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>},
  ErrorValues extends BaseErrorValuesType<FormSpec>
    = DefaultErrorValuesType<FormSpec>
> {
  initialValues: Partial<FormData>;
  errors?: ErrorValues;

  fieldsSpec: FormSpec;

  inputProps: {
    [key in keyof FormSpec]: {
      onBlur: FocusEventHandler;
      onFocus: FocusEventHandler;
    }
  };
  values?: {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > };

  constructor(args: {
    initialValues?: Partial<FormData>;
    fieldsSpec: FormSpec;
    validator? (
      formState: string,
    ): MaybePromise<null | ErrorValues>;
    streamValidatorFactory? (
      formStateStream: Observable<string>,
    ): Observable<null | ErrorValues>;
  }) {
    const {
      initialValues,
      fieldsSpec,
    } = args;

    this.initialValues = initialValues || {};
    this.fieldsSpec = fieldsSpec;
    this.inputProps = mapObjIndexed(
      (value, key) => ({
        onBlur: (evt: FocusEvent) => {
          // ...
        },
      }),
      fieldsSpec,
    ) as any;
  }
}
