import { observable } from 'mobx';
import { mapObjIndexed } from 'ramda';
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
import { FormSpecBase } from './types/FormSpecBase';
import { MaybePromise } from './types/MaybePromise';

export class MobxStateManager <
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>
    = DefaultErrorValuesType<FormSpec>
> {
  initialValues: Partial<FormData>;
  errors?: ErrorValues;

  fieldsSpec: FormSpec;

  inputEventHandlers: EventHandlers<FormSpec>;

  eventStreams: EventStreams<FormSpec>;
  // values?: {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > };
  @observable formState: FormState<FormSpec> = {
    active: null,
    touched: {},
    values: {},
  };

  constructor(args: {
    initialValues?: Partial<FormData>;
    fieldsSpec: FormSpec;
    streamValidatorFactory? (
      formStateStream: Observable<FormState<FormSpec>>,
      eventStreams: EventStreams<FormSpec>,
    ): Observable<null | ErrorValues>;
  }) {
    const {
      initialValues,
      fieldsSpec,
    } = args;

    this.initialValues = initialValues || {};
    this.fieldsSpec = fieldsSpec;
    this.eventStreams = createEventStreams(fieldsSpec);
    this.inputEventHandlers = mapObjIndexed(
      (value, key) => this.createEventHandlersFor(key, fieldsSpec),
      fieldsSpec,
    ) as any;
  }

  private createEventHandlersFor<
    fieldNameType extends keyof FormSpec,
    Value extends FormSpec[fieldNameType]
  >(
    fieldName: keyof FormSpec,
    fieldsSpec: FormSpec,
  ): EventHandler<FormSpec, fieldNameType, Value> {
    // tslint:disable no-this-assignment
    const self = this;

    return {
      onBlur() {
        self.eventStreams.focusStreams[fieldName].next(false);
      },
      onFocus() {
        self.eventStreams.focusStreams[fieldName].next(true);
      },
      onChange(value: Value) {
        self.eventStreams.changeStreams[fieldName].next(value);
      },
    };
  }
}
