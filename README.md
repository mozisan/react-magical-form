# react-magical-form

## Attention

This package is published as ES Modules, so please use a bundler such as Webpack.

## Table of contents

- [Installation](#Installation)
- [Basic usage](#basic-usage)
- [Supported field types](#supported-field-types)
- [Validation](#validation)
- [Magical type refinement](#magical-type-refinement)
- [APIs](#apis)
- [Customizing error messages](#customizing-error-messages)
- [Using your own validators](#using-your-own-validators)
- [License](#license)

## Installation

```sh
npm install -S react-magical-form
```

```sh
yarn add react-magical-form
```

## Basic Usage

```tsx
import React from 'react';
import { checkbox, number, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, handleSubmit } = useForm({
    name: text(),
    age: number(),
    acceptsPolicy: checkbox(),
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // Do something
      })}
    >
      <div>
        <input ref={field('name')} type="text" />
      </div>

      <div>
        <input ref={field('age')} type="number" />
      </div>

      <div>
        <input ref={field('acceptsPolicy')} type="checkbox" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Supported field types

### `text()`

Results in `string`.

```tsx
import React from 'react';
import { text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: text({ initial: '' }),
  });

  getValues().foo; //=> string

  return <input ref={field('foo')} type="text" />;
};
```

### `number()`

Results in `number | undefined`.

```tsx
import React from 'react';
import { number, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: number({ initial: undefined }),
  });

  getValues().foo; //=> number | undefined

  return <input ref={field('foo')} type="number" />;
};
```

### `checkbox()`

Results in `boolean`.

```tsx
import React from 'react';
import { checkbox, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: checkbox({ initial: false }),
  });

  getValues().foo; //=> boolean

  return <input ref={field('foo')} type="checkbox" />;
};
```

### `textChoice()`

Results in `string | undefined`.

```tsx
import React from 'react';
import { textChoice, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: textChoice({ initial: undefined }),
  });

  getValues().foo; //=> string | undefined

  return (
    <>
      <input ref={field('foo')} type="radio" name="foo" value="bar" />
      {/*                       ^^^^^^^^^^^^
                                `type` property is required and it should be "radio".
      */}
      <input ref={field('foo')} type="radio" name="foo" value="baz" />
      {/*                                    ^^^^^^^^^^
                                             `name` property is required
                                               with the same value of field name.
      */}
    </>;
  );
};
```

### `numberChoice()`

Results in `number | undefined`.

```tsx
import React from 'react';
import { numberChoice, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: numberChoice({ initial: undefined }),
  });

  getValues().foo; //=> number | undefined

  return (
    <>
      <input ref={field('foo')} type="radio" name="foo" value="0" />
      {/*                       ^^^^^^^^^^^^
                                `type` property is required and it should be "radio".
      */}
      <input ref={field('foo')} type="radio" name="foo" value="1" />
      {/*                                    ^^^^^^^^^^
                                             `name` property is required
                                               with the same value of field name.
      */}
    </>;
  );
};
```

### `file()`

Results in `File | undefined`.

```tsx
import React from 'react';
import { file, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: file(),
  });

  getValues().foo; //=> File | undefined

  return <input ref={field('foo')} type="file" />;
};
```

### `files()`

Results in `readonly File[]`.

```tsx
import React from 'react';
import { files, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field, getValues } = useForm({
    foo: files(),
  });

  getValues().foo; //=> readonly File[]

  return <input ref={field('foo')} type="file" multiple />;
};
```

## Validation

### Field spec

#### `required()`

```tsx
import React from 'react';
import {
  checkbox,
  file,
  files,
  number,
  numberChoice,
  required,
  text,
  textChoice,
  useForm,
} from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: required(), // should not be empty
    }),
    f2: textChoice({
      spec: required(), // should be selected
    }),
    f3: number({
      spec: required(), // should be empty and a number value
    }),
    f4: numberChoice({
      spec: required(), // should be selected
    }),
    f5: checkbox({
      spec: required(), // should be checked
    }),
    f6: file({
      spec: required(), // should be uploaded
    }),
    f7: files({
      spec: required(), // should be uploaded at least one
    }),
  });

  return null;
};
```

#### `minLength(limit: number)`

```tsx
import React from 'react';
import { minLength, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: minLength(10), // should have length which is greater than or equal to 10
    }),
  });

  return null;
};
```

#### `maxLength(limit: number)`

```tsx
import React from 'react';
import { maxLength, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: maxLength(32), // should have length which is smaller than or equal to 32
    }),
  });

  return null;
};
```

#### `pattern(regexp: RegExp)`

```tsx
import React from 'react';
import { pattern, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: pattern(/-foo-/), // should match given pattern
    }),
  });

  return null;
};
```

#### `oneOfTexts(...values: readonly string[])`

```tsx
import React from 'react';
import { oneOfTexts, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: oneOfTexts('foo', 'bar', 'baz'), // should be one of 'foo', 'bar', and 'baz'
    }),
  });

  return null;
};
```

#### `min(limit: number)`

```tsx
import React from 'react';
import { min, number, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: number({
      spec: min(1), // should be greater than or equal to 1
    }),
  });

  return null;
};
```

#### `max(limit: number)`

```tsx
import React from 'react';
import { max, number, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: number({
      spec: max(10), // should be smaller than or equal to 10
    }),
  });

  return null;
};
```

#### `range(min: number, max: number)`

```tsx
import React from 'react';
import { number, range, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: number({
      spec: range(0, 10), // should be between 0 and 10
    }),
  });

  return null;
};
```

#### `integer()`

```tsx
import React from 'react';
import { integer, number, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: number({
      spec: integer, // should be an integer
    }),
  });

  return null;
};
```

#### `oneOfNumbers(...values: readonly number[])`

```tsx
import React from 'react';
import { oneOfNumbers, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: oneOfNumbers(1, 2, 3), // should be one of 1, 2, and 3
    }),
  });

  return null;
};
```

#### `exact<T extends number | string>(value: T)`

```tsx
import React from 'react';
import { exact, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  useForm({
    f1: text({
      spec: exact('foo'), // should be 'foo'
    }),
  });

  return null;
};
```

#### `confirmationOf<T extends number | string>(value: T)`

Alias to `exact()`, but its default error message is different.  
This is supporsed to used in [`useRules()`](#form-rules).

### Form rules

If some fields have rules depend on other fields, use `useRules()`.

```tsx
import React from 'react';
import {
  confirmationOf,
  required,
  text,
  useForm,
  validationError,
} from 'react-magical-form';

export const Form: React.FC = () => {
  const { useRules } = useForm({
    password: text({
      spec: required(),
    }),
    passwordConfirmation: text({
      spec: required(),
    }),
  });

  // If you use `useRules()`, DO NOT USE any apis from `useForm()` except `useRules()`.
  // Instead, use apis from `useRules()`.
  const { errors, field, getValues, ...apis } = useRules({
    passwordConfirmation: (otherValues) => confirmationOf(otherValues.password),
  });

  return null;
};
```

## Magical type refinement

If `handleSubmit` runs its callback, all validations should be passed, so some types of field values can be refined.  
react-magical-form implements this behavior.

### Refinement by `required()`

```tsx
import React from 'react';
import {
  checkbox,
  file,
  files,
  number,
  numberChoice,
  required,
  textChoice,
  useForm,
} from 'react-magical-form';

export const Form: React.FC = () => {
  const { getValues, handleSubmit } = useForm({
    f1: textChoice({
      spec: required(),
    }),
    f2: number({
      spec: required(),
    }),
    f3: numberChoice({
      spec: required(),
    }),
    f4: checkbox({
      spec: required(),
    }),
    f5: file({
      spec: required(),
    }),
    f6: files({
      spec: required(),
    }),
  });

  getValues().f1; //=> string | undefined
  getValues().f2; //=> number | undefined
  getValues().f3; //=> number | undefined
  getValues().f4; //=> boolean
  getValues().f5; //=> File | undefined
  getValues().f6; //=> readonly File[]

  return (
    <form
      onSubmit={handleSubmit((values) => {
        values.f1; //=> string
        values.f2; //=> number
        values.f3; //=> number
        values.f4; //=> true
        values.f5; //=> File
        values.f6; //=> readonly [File, ...File[]]
      })}
    />
  );
};
```

### Refinement by `oneOfTexts()`

```tsx
import React from 'react';
import {
  number,
  numberChoice,
  oneOfTexts,
  text,
  textChoice,
  useForm,
} from 'react-magical-form';

export const Form: React.FC = () => {
  const { getValues, handleSubmit } = useForm({
    f1: textChoice({
      spec: oneOfTexts('foo', 'bar'),
    }),
  });

  getValues().f1; //=> string | undefined

  return (
    <form
      onSubmit={handleSubmit((values) => {
        values.f1; //=> "foo" | "bar" | undefined
      })}
    />
  );
};
```

### Refinement by `oneOfNumbers()`

```tsx
import React from 'react';
import {
  number,
  numberChoice,
  oneOfNumbers,
  text,
  textChoice,
  useForm,
} from 'react-magical-form';

export const Form: React.FC = () => {
  const { getValues, handleSubmit } = useForm({
    f1: number({
      spec: oneOfNumbers(1, 2),
    }),
    f2: numberChoice({
      spec: oneOfNumbers(1, 2),
    }),
  });

  getValues().f1; //=> number | undefined
  getValues().f2; //=> number | undefined

  return (
    <form
      onSubmit={handleSubmit((values) => {
        values.f1; //=> 1 | 2 | undefined
        values.f2; //=> 1 | 2 | undefined
      })}
    />
  );
};
```

### Refinement composition

```tsx
import React from 'react';
import {
  compose,
  number,
  numberChoice,
  oneOfNumbers,
  oneOfTexts,
  required,
  textChoice,
  useForm,
} from 'react-magical-form';

export const Form: React.FC = () => {
  const { getValues, handleSubmit } = useForm({
    f1: textChoice({
      spec: oneOfTexts('foo', 'bar'),
    }),
    f2: textChoice({
      spec: compose(
        required(),
        oneOfTexts('foo', 'bar'),
      ),
    }),
    f3: number({
      spec: oneOfNumbers(1, 2),
    }),
    f4: numberChoice({
      spec: compose(
        required(),
        oneOfNumbers(1, 2),
      ),
    }),
  });

  getValues().f1; //=> string | undefined
  getValues().f2; //=> string | undefined
  getValues().f3; //=> number | undefined
  getValues().f4; //=> number | undefined

  return (
    <form
      onSubmit={handleSubmit((values) => {
        values.f1; //=> "foo" | "bar" | undefined
        values.f2; //=> "foo" | "bar"
        values.f3; //=> 1 | 2 | undefined
        values.f4; //=> 1 | 2
      })}
    />
  );
};
```

### Refinement by `useRules()`

```tsx
import React from 'react';
import {
  compose,
  confirmationOf,
  oneOfTexts,
  required,
  text,
  textChoice,
  useForm,
} from 'react-magical-form';

export const Form: React.FC = () => {
  const { useRules } = useForm({
    field: textChoice({
      spec: compose(
        required(),
        oneOfTexts('foo', 'bar'),
      ),
    }),
    fieldConfirmation: text(),
  });

  const { getValues, handleSubmit } = useRules({
    fieldConfirmation: (otherFields) => confirmationOf(otherFields.field),
  });

  getValues().field; //=> string | string
  getValues().fieldConfirmation; //=> string

  return (
    <form
      onSubmit={handleSubmit((values) => {
        values.field; //=> "foo" | "bar"
        values.fieldConfirmation; //=> "foo" | "bar"
      })}
    />
  );
};
```

## APIs

### `field(fieldName: <NAME_OF_FIELD>)`

Bind HTML element to field instance.

```tsx
import React from 'react';
import { text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { field } = useForm({
    f1: text(),
  });

  return <input ref={field('f1')} />;
};
```

### `useRules(rules: <FORM_RULES>)`

Set form rules and return new form APIs.

```tsx
const { useRules } = useForm({
  beginning: number({
    spec: required(),
  }),
  end: numberChoice({
    spec: required(),
  }),
});

const { errors, field, getValues, ...apis } = useRules({
  end: (otherValues) => min(otherValues.beginning),
});

return null;
```

### `getValues()`

```tsx
import React from 'react';
import { number, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { getValues } = useForm({
    f1: text(),
    f2: number(),
  });

  getValues(); //=> { "f1": string, "f2": number | undefined }

  return null;
};
```

### `setValue(fieldName: <NAME_OF_FIELD>, value: <VALUE_TYPE_OF_FIELD>)`

```tsx
import React from 'react';
import { number, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { setValue } = useForm({
    f1: number(),
  });

  setValue('f1', 0);
  setValue('f1', undefined);

  return null;
};
```

### `setValues(values: <VALUES_TYPE>)`

```tsx
import React from 'react';
import { number, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { setValues } = useForm({
    f1: text(),
    f2: number(),
  });

  setValues({
    f1: 'foo',
    f2: 1,
  });

  return null;
};
```

### `errors`

Error messages of latest validation, as object with same keys of fields.

```tsx
import React from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { errors } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  errors; //=> { "f1": readonly string[] }

  return null;
};
```

### `validate()`

Runs validations manually.

```tsx
import React, { useEffect } from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { validate } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  useEffect(() => {
    validate();
  }, []);

  return null;
};
```

### `reset()`

Sets all field values to initial values and clears all errors.

```tsx
import React, { useEffect } from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { reset } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  useEffect(() => {
    reset();
  }, []);

  return null;
};
```

### `clear()`

Clears all field values and errors.

```tsx
import React, { useEffect } from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { clear } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  useEffect(() => {
    clear();
  }, []);

  return null;
};
```

### `clearErrors()`

Clears all errors.

```tsx
import React, { useEffect } from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { clearErrors } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  useEffect(() => {
    clearErrors();
  }, []);

  return null;
};
```

### `handleSubmit(f: (values: <VALUES_TYPE>) => void | Promise<void>)`

Handles form submittion running given callback.

```tsx
import React, { useEffect } from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { handleSubmit } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  return <form onSubmit={handleSubmit(() => {})} />;
};
```

### `isSubmitting`

```tsx
import React from 'react';
import { required, text, useForm } from 'react-magical-form';

export const Form: React.FC = () => {
  const { isSubmitting } = useForm({
    f1: text({
      spec: required(),
    }),
  });

  isSubmitting; //=> boolean

  return null;
};
```

## Customizing error messages

[WIP]

## Using your own validators

[WIP]

## License

MIT
