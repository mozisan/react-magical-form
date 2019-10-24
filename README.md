# @mozisan/react-form

## Installation

```shell
$ npm install -S @mozisan/react-form
```

```shell
$ yarn add @mozisan/react-form
```

## Basic usage

```typescriptreact
import {
  boolean,
  number,
  string,
  useForm,
} from '@mozisan/react-form';
import React from 'react';

export const RegistrationForm: React.FC = () => {
  const { field, handleSubmit } = useForm({
    fields: {
      name: string(),
      age: number(),
      acceptsPolicy: boolean(),
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => { ... })}>
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
