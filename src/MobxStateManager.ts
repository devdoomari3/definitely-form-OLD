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
import { FormState } from './FormState';

export class MobxStateManager <
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>
    = DefaultErrorValuesType<FormSpec>
> {
  initialValues: Partial<FormData>;
  errors?: ErrorValues;

  fieldsSpec: FormSpec;

  inputEventHandlers: {
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
      formState: FormState<FormSpec>,
    ): MaybePromise<null | ErrorValues>;
    streamValidatorFactory? (
      formStateStream: Observable<FormState<FormSpec>>,
    ): Observable<null | ErrorValues>;
  }) {
    const {
      initialValues,
      fieldsSpec,
    } = args;

    this.initialValues = initialValues || {};
    this.fieldsSpec = fieldsSpec;
    this.inputEventHandlers = mapObjIndexed(
      (value, key) => ({
        onBlur: (evt: FocusEvent) => {
          // ...
        },
      }),
      fieldsSpec,
    ) as any;
  }

  private createEventHandlersFor<
    fieldNameType extends keyof FormSpec,
    Value extends FormSpec[fieldNameType]
  >(
    // fieldName: keyof FormSpec,
  ) {
    return {
      onBlur: (value: T)
    }
  }
}
