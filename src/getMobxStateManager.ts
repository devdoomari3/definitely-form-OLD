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
import {
  MobxStateManager,
} from './MobxStateManager';
import { createField } from './types/CreateField';
import {
  BaseErrorValuesType,
  DefaultErrorValuesType,
} from './types/ErrorValueType';
import {
  ParsedValueProperty,
  ValueProperty,
} from './types/ExtractType';
import {
  FormData,
  FormDataParsed,
} from './types/FormData';
import { FormSpecBase } from './types/FormSpecBase';
import { GetFields } from './types/GetFields';
import { MaybePromise } from './types/MaybePromise';

export function getMobxStateManager<
  FormSpec extends FormSpecBase,
>(
  getFields: GetFields<FormSpec>,
  initialValues?: FormData<FormSpec>,
) {
  const fieldsSpec = getFields(createField);

  function _getMobxStateManagerWithValidation<
    ErrorValues extends BaseErrorValuesType<FormSpec>
      = DefaultErrorValuesType<FormSpec>
  >(args: {
    streamValidatorFactory?: undefined;
    validator? (
      formState: string,
    ): MaybePromise<null | ErrorValues>;
  } | {
    validator?: undefined;
    streamValidatorFactory? (
      formStateObservable: Observable<string>,
    ): Observable<null | ErrorValues>;
  }) {
    return new MobxStateManager<
      FormSpec,
      FormData<FormSpec>,
      FormDataParsed<FormSpec>,
      ErrorValues
    >({
      initialValues,
      fieldsSpec,
    });
  }

  return _getMobxStateManagerWithValidation;
}
