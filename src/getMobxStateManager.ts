import {
  Observable,
} from 'rxjs';
import { EventStreams } from './EventStreams';
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
} from './types/FormData';
import { FormSpecBase } from './types/FormSpecBase';
import { GetFields } from './types/GetFields';

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
  } | {
    validator?: undefined;
    streamValidatorFactory? (
      formStateStream: Observable<FormState<FormSpec>>,
      eventStreams: EventStreams<FormSpec>,
    ): Observable<null | ErrorValues>;
  }) {

    const {
      streamValidatorFactory,
    } = args;

    return new MobxStateManager<
      FormSpec,
      ErrorValues
    >({
      initialValues,
      fieldsSpec,
      streamValidatorFactory,
    });
  }

  return _getMobxStateManagerWithValidation;
}
