import {
  Observable,
} from 'rxjs';
import { FormState } from './FormState';
import {
  MobxStateManager,
} from './MobxStateManager';
import { createField } from './types/CreateField';
import {
  BaseErrorValuesType,
  DefaultErrorValuesType,
} from './types/ErrorValueType';
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
      formState: FormState<FormSpec>,
    ): MaybePromise<null | ErrorValues>;
  } | {
    validator?: undefined;
    streamValidatorFactory? (
      formStateObservable: Observable<FormState<FormSpec>>,
    ): Observable<null | ErrorValues>;
  }) {

    const {
      validator,
      streamValidatorFactory,
    } = args;

    return new MobxStateManager<
      FormSpec,
      ErrorValues
    >({
      initialValues,
      fieldsSpec,
      validator,
      streamValidatorFactory,
    });
  }

  return _getMobxStateManagerWithValidation;
}
