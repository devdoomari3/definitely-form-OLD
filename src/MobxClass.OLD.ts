// import {
//   observable,
// } from 'mobx';

// import {
//   createForm,
// } from 'final-form';
// import { createField } from './types/CreateField';
// import {
//   ParsedValueProperty,
//   ValueProperty,
// } from './types/ExtractType';
// import { FormSpecBase } from './types/FormSpecBase';
// import { GetFields } from './types/GetFields';

// export abstract class BaseMobxClass<
//   FormData,
//   FormDataParsed,
//   // ErrorValues,
//   // initialValues,
// > {
//   abstract formData: Partial<FormData>;
//   abstract formDataParsed: Partial<FormDataParsed>;
// }

// export function getMobxStateManager<
//   FormSpec extends FormSpecBase
// >(
//   getFields: GetFields<FormSpec>,
//   initialValues?: {
//     [key in keyof FormSpec]: ValueProperty<FormSpec[key]>
//   },
// ): new() => BaseMobxClass<
//   { [key in keyof FormSpec]: ValueProperty<FormSpec[key]> },
//   { [key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]> }
// > {
//   type test = {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > };

//   const fieldSpecs = getFields(createField);
//   const fieldNames = Object.keys(fieldSpecs);

//   class MobxClass extends BaseMobxClass <
//     {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > },
//     {[key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>}
//   > {

//     form = createForm({
//       initialValues,
//       onSubmit: () => undefined,
//     });

//     formData = observable.object<
//       { [key in keyof FormSpec]?: ValueProperty<FormSpec[key]> }
//     >(initialValues || {});

//     formDataParsed = observable.object<
//       { [key in keyof FormSpec]?: ParsedValueProperty<FormSpec[key]> }
//     >({});

//     values?: {[key in keyof FormSpec]: ValueProperty<FormSpec[key] > };
//   }

//   return MobxClass;
// }
