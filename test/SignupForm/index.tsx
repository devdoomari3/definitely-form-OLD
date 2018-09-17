import {
  observer,
} from 'mobx-react';
import * as React from 'react';
import {
  render,
} from 'react-dom';
import { ReactComponent } from '../../src/React';
import { formStateManager } from './formStateManager';
export type PropsType = {
};

const TestForm: React.StatelessComponent<PropsType> = observer(
  props => {
    return (
      <ReactComponent
        stateManager={formStateManager}
      >
        {({
          inputEventHandlers,
        }) => {
          return (
            <div>

              <input
                type='text'
                {...inputEventHandlers.name}
                onChange={
                  (evt) => {
                    inputEventHandlers
                      .name
                      .onChange(evt.target.value);
                  }
                }
              />
            </div>
          );
        }}
      </ReactComponent>
    );
  },
);

render(
  <TestForm
  />,
  document.getElementById('app'),
);
