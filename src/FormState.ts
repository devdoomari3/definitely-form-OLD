import {
  FormData,
} from './types/FormData';
import { FormSpecBase } from './types/FormSpecBase';
// // props = {
// //   "values": {
// //     "email": "s"
// //   },
// //   "errors": {
// //     "email": "Invalid email address"
// //   },
// //   "touched": {
// //     "email": true
// //   },
// //   "isSubmitting": false,
// //   "dirty": true,
// //   "isValid": false
// // }

export type FormState<
  FormSpec extends FormSpecBase
> = {
  active: keyof FormSpec | null;
  touched: {
    [key in keyof FormSpec]: boolean;
  };
  values: FormData<FormSpec>;
  isInvalid: boolean;
};
