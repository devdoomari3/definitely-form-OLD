import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
  formState: Observable<FormState<FormSpec>>,
  eventStreams: EventStreams<FormSpec>,
) => Observable<ErrorValues | null>;

export class RxJSStateManager <
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
  formStateStream: BehaviorSubject<FormState<FormSpec>>;

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
    this.formStateStream = new BehaviorSubject<FormState<FormSpec>>({
      active: null,
      touched: {},
      edited: {},
      values: {},
    });
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
        self.formStateStream.next({
          ...self.formStateStream.value,
          active: null,
        });
        self.eventStreams.focusStreams[fieldName].next(false);
      },
      onFocus() {
        // const oldFormState = self.formStateStream.value;
        // const oldFormStateTouched = oldFormState.touched || {},
        self.formStateStream.next({
          ...self.formStateStream.value,
          active: fieldName,
          // tslint:disable-next-line:prefer-object-spread
          touched: Object.assign(
            self.formStateStream.value.touched,
            {
              [fieldName]: true,
            },
          ),
        });
        self.eventStreams.focusStreams[fieldName].next(true);
      },
      onChange(value: Value) {
        self.formStateStream.next({
          ...self.formStateStream.value,
          active: fieldName,
          touched: {

          },
        });
        self.formState.edited[fieldName] = true;
        self.formState.values[fieldName] = value;
        self.eventStreams.changeStreams[fieldName].next(value);
      },
    };
  }
}
