import {
  computed,
  observable,
} from 'mobx';
import {
  IObservableStream,
  toStream,
} from 'mobx-utils';
import { Observable } from 'rxjs/observable';
import {
  createEventStreams,
  EventStreams,
} from './EventStreams';
import { FormState } from './FormState';
import {
  BaseErrorValuesType,
  DefaultErrorValuesType,
} from './types/ErrorValueType';
import {
  EventHandler,
  EventHandlers,
} from './types/EventHandler';
import { ValueProperty } from './types/ExtractType';
import { FormSpecBase } from './types/FormSpecBase';
import { mapObject } from './utils/ObjectMap';

export type StreamValidatorFactory<
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>
> = (
  formState: IObservableStream<FormState<FormSpec>>,
  eventStreams: EventStreams<FormSpec>,
) => Observable<ErrorValues | null>;

export class MobxRxJSStateManager <
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>
    = DefaultErrorValuesType<FormSpec>
> {
  initialValues: Partial<FormData>;
  errors?: ErrorValues;

  fieldsSpec: FormSpec;

  inputEventHandlers: EventHandlers<FormSpec>;

  eventStreams: EventStreams<FormSpec>;
  errorStream: Observable<ErrorValues | null>;
  // values?: {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > };
  @observable formState: FormState<FormSpec> = {
    active: null,
    touched: {},
    edited: {},
    values: {},
  };
  formStateStream = toStream(() => this.formState);
  constructor(args: {
    initialValues?: Partial<FormData>;
    fieldsSpec: FormSpec;
    toStreamValidator: StreamValidatorFactory<FormSpec, ErrorValues>;
  }) {
    const {
      initialValues,
      fieldsSpec,
    } = args;

    this.eventStreams = createEventStreams(fieldsSpec);
    this.errorStream = args.toStreamValidator(
      this.formStateStream,
      this.eventStreams,
    );
    this.initialValues = initialValues || {};
    this.fieldsSpec = fieldsSpec;

    this.inputEventHandlers = mapObject(
      (value, key) => this.createEventHandlersFor(key, fieldsSpec),
      fieldsSpec,
    );
  }

  private createEventHandlersFor<
    fieldNameType extends keyof FormSpec,
    Value extends ValueProperty<FormSpec[fieldNameType]>
  >(
    fieldName: keyof FormSpec,
    fieldsSpec: FormSpec,
  ): EventHandler<FormSpec, fieldNameType, Value> {
    // tslint:disable no-this-assignment
    const self = this;

    return {
      onBlur() {
        self.formState.active = null;
        self.eventStreams.focusStreams[fieldName].next(false);
      },
      onFocus() {
        self.formState.active = fieldName;
        self.formState.touched[fieldName] = true;
        self.eventStreams.focusStreams[fieldName].next(true);
      },
      onChange(value: Value) {
        self.formState.edited[fieldName] = true;
        self.formState.values[fieldName] = value;
        self.eventStreams.changeStreams[fieldName].next(value);
      },
    };
  }
}
