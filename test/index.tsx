import {
  observer,
} from 'mobx-react';
import * as React from 'react';
import {
  render,
} from 'react-dom';
import { map } from 'rxjs/operators/map';
import {
  getMobxStateManager,
} from '../src/getMobxStateManager';
import {
  BaseUsernameError,
  UsernameTooShort,
} from './UsernameErrors';

const formStateManager = getMobxStateManager(
  f => ({
    name: f<string>(),
    age: f<string, number>(Number),
  }),
)<{
  name: BaseUsernameError | null;
  age: string | number;
}>({
  streamValidatorFactory(formStateStream) {
    const userNameValidation = formStateStream.pipe(

    )
    return formStateStream.pipe(
      map(a => ({
        name: new UsernameTooShort(),
        age: '123',
      })),
    );
  },
});

// check for errors type:
// const test = formStateManager.errors && formStateManager.errors.name;

const {
  inputEventHandlers,
  errors,
} = formStateManager;

export type PropsType = {
  formStateManager: typeof formStateManager;
};

const TestForm: React.StatelessComponent<PropsType> = observer(
  props => {
    return (
      <div>
        <p>asd</p>
        <input
          type='text'
          {...inputEventHandlers.age}
        />
        <p className='Error'> {errors && errors.age} </p>
      </div>
    );
  },
);

render(
  <TestForm
    formStateManager={formStateManager}
  />,
  document.getElementById('app'),
);
