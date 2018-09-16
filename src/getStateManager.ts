import {
  RxJSStateManager,
  StreamValidatorFactory,
} from './RxJSStateManager';
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

export function createFormState<
  FormSpec extends FormSpecBase,
>(
  getFields: GetFields<FormSpec>,
  initialValues?: FormData<FormSpec>,
) {
  const fieldsSpec = getFields(createField);

  function withRxjsManager<
    ErrorValues extends BaseErrorValuesType<FormSpec>
      = DefaultErrorValuesType<FormSpec>
  >(args: {
    toStreamValidator: StreamValidatorFactory<FormSpec, ErrorValues>;
  }) {
    const {
      toStreamValidator,
    } = args;

    return new RxJSStateManager<
      FormSpec,
      ErrorValues
    >({
      initialValues,
      fieldsSpec,
      toStreamValidator,
    });
  }

  return {
    withRxjsManager,
  };
}
