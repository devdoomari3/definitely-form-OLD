import {
  observable,
} from 'mobx';
import {
  mapObjIndexed,
} from 'ramda';
import {
  Observable,
} from 'rxjs';

import {
  createForm,
} from 'final-form';
import { FocusEventHandler } from 'react';
import { createField } from './types/CreateField';
import {
  ParsedValueProperty,
  ValueProperty,
} from './types/ExtractType';
import { FormSpecBase } from './types/FormSpecBase';
import { GetFields } from './types/GetFields';
import { MaybePromise } from './types/MaybePromise';

export abstract class BaseMobxClass<

  FormData,
  FormDataParsed,
  ErrorValues,
> {
  constructor() {

  }
  formData = observable.object<
      Partial<FormData>
    >(initialValues || {});

  formDataParsed = observable.object<
    Partial<FormDataParsed>
  >({});
}

export function getMobxStateManager<
  FormSpec extends FormSpecBase,
>(
  getFields: GetFields<FormSpec>,
  initialValues?: {
    [key in keyof FormSpec]: ValueProperty<FormSpec[key]>
  },
) {
  type BaseErrorValuesType = {
    [key in keyof FormSpec]: any;
  };
  type DefaultErrorValuesType = {
    [key in keyof FormSpec]: string;
  };
  const fieldSpecs = getFields(createField);

  class MobxClass<
    FormData = {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > },
    FormDataParsed = {[key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>},
    ErrorValues extends BaseErrorValuesType = {
      [key in keyof FormSpec]: string
    }
  > extends BaseMobxClass <
    FormData,
    FormDataParsed,
    ErrorValues
  > {
    initialValues: Partial<FormData>;



    errors?: ErrorValues;

    inputProps: {
      [key in keyof FormSpec]: {
        onBlur: FocusEventHandler;
        onFocus: FocusEventHandler;
      }
    } = mapObjIndexed(
      (value, key) => ({
        onBlur: (evt: FocusEvent) => {
          // ...
        },
      }),
      fieldSpecs,
    ) as any;
    values?: {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > };

    constructor(args: {
      initialValues?: Partial<FormData>;
      validator? (
        formState: string,
      ): MaybePromise<null | ErrorValues>;
      streamValidatorFactory? (
        formStateStream: Observable<string>,
      ): Observable<null | ErrorValues>;
    }) {
      super();
      this.initialValues = initialValues || {};
    }

    configure<
      _ErrorValues extends BaseErrorValuesType = DefaultErrorValuesType
    >(
      // prevent validator + streamValidatorFactory
      args: {
        streamValidatorFactory?: undefined;
        validator? (
          formState: string,
        ): MaybePromise<null | _ErrorValues>;
      } | {
        validator?: undefined;
        streamValidatorFactory? (
          formStateObservable: Observable<string>,
        ): Observable<null | _ErrorValues>;
      },
    ) {
      const {
        validator,
        streamValidatorFactory,
      } = args;

      return new MobxClass<
        FormData,
        FormDataParsed,
        _ErrorValues
      >({
        initialValues: this.initialValues,
        validator,
        streamValidatorFactory,
      });
    }
  }

  return new MobxClass({});
}
