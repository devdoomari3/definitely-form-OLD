import {
  observer,
} from 'mobx-react';
import * as React from 'react';
import {
  render,
} from 'react-dom';
import { FromObservable } from 'rxjs/observable/FromObservable';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import {
  createFormState,
} from '../../src/getStateManager';
import {
  BaseUsernameError,
  UsernameTooShort,
} from './UsernameErrors';

export const formStateManager = createFormState(
  f => ({
    name: f<string>(),
    age: f<string, number>(Number),
  }),
).withRxjsManager<{
  name: BaseUsernameError | null;
  age: string | number;
}>({
  toStreamValidator(
    formStateStream,
    eventStreams,
  ) {
    const userNameValidation = eventStreams
                                .changeStreams
                                .name
                                .pipe(
                                  map(v => )
                                )

    return formStateStream.pipe(
      map(a => ({
        name: new UsernameTooShort(),
        age: '123',
      })),
    );
  },
});
