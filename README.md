# react-magical-form

## Installation

```sh
$ npm install -S react-magical-form
```

```sh
$ yarn add react-magical-form
```

## Basic usage

```tsx
import React from 'react';
import {
  boolean,
  number,
  string,
  useForm,
} from 'react-magical-form';

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
