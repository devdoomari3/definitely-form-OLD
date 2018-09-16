import * as React from 'react';
import { MobxRxJSStateManager } from './MobxRxJSStateManager';
import { BaseErrorValuesType } from './types/ErrorValueType';
import { EventHandlers } from './types/EventHandler';
import { FormSpecBase } from './types/FormSpecBase';

export type PropsType<
  FormSpec extends FormSpecBase,
  ErrorValues extends BaseErrorValuesType<FormSpec>,
> = {
  stateManager: MobxRxJSStateManager<FormSpec, ErrorValues>;
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
  >
> {
  componentDidMount() {
    // subscribe to stateManager.

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
