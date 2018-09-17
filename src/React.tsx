import * as React from 'react';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { RxJSStateManager } from './RxJSStateManager';
import { BaseErrorValuesType } from './types/ErrorValueType';
import { EventHandlers } from './types/EventHandler';
import { FormSpecBase } from './types/FormSpecBase';

export type PropsType<
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>,
> = {
  stateManager: RxJSStateManager<FormSpec, ErrorValues>;
  children(props: {
    inputEventHandlers: EventHandlers<FormSpec>;
  }): React.ReactElement<any>;
};

export type StateType<
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>,
> = {
  stateManager: RxJSStateManager<FormSpec, ErrorValues>;
  children(props: {
    inputEventHandlers: EventHandlers<FormSpec>;
  }): React.ReactElement<any>;
};
export class ReactComponent<
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>,
> extends React.Component<
  PropsType<
    FormSpec,
    ErrorValues
  >,
  StateType<
    FormSpec,
    ErrorValues
  >
> {
  subscription?: Subscription;
  componentDidMount() {
    // subscribe to stateManager.
    const {
      stateManager,
    } = this.props;
    this.subscription = stateManager
                .formStateStream
                .pipe(
                  combineLatest(
                    stateManager.errorStream,
                    (formState, errors) => ({
                      formState, errors,
                    }),
                  ),
                )
                .subscribe(({
                  formState,
                  errors,
                }) => {
                  this.setState({
                    formState,
                    errors,
                  });
                });
  }
  componentWillUnmount() {
    // unsubscribe to stateManager.
  }
  render() {
    const {
      stateManager,
    } = this.props;
    const {
      inputEventHandlers,
    } = stateManager;

    return this.props.children({
      inputEventHandlers,
    });
  }
}
