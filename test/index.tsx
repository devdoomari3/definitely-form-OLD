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
} from '../src/MobxClass';

const formStateManager = getMobxStateManager(
  f => ({
    name: f<string>(),
    age: f<string, number>(Number),
  }),
).configure({
  streamValidatorFactory(formStateStream) {
    return formStateStream.pipe(
      map(a => ({
        name: '123',
        age: '123',
      })),
    );
  },
});

const {
  inputProps,
  errors,
} = formStateManager;

export const TestForm: React.StatelessComponent<{}> = props => {
  return (
    <div>
      <input type='text' {...inputProps.age} />
      <p className='Error'> {errors && errors.age} </p>
    </div>
  );
};

render(<TestForm />, document.getElementById('app'));
