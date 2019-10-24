import { cleanup, fireEvent, render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import React, { MutableRefObject, Ref, useEffect, useRef } from 'react';

import {
  boolean,
  max,
  min,
  number,
  range,
  required,
  string,
  useForm,
  ValidationError,
} from '.';

const combineRefs = <T,>(...refs: readonly Ref<T>[]): Ref<T> => (
  target: T | null,
) => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(target);
    } else {
      // eslint-disable-next-line functional/immutable-data
      ((ref as unknown) as MutableRefObject<T | null>).current = target;
    }
  });
};

describe('useForm()', () => {
  afterEach(cleanup);

  describe('field()', () => {
    describe('element bindings', () => {
      describe('boolean field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: boolean(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).not.toBe(true);

              // eslint-disable-next-line functional/immutable-data
              fooInputRef.current.checked = true;
              fooInputRef.current.dispatchEvent(new Event('input'));

              expect(getValues().foo).toBe(true);

              done();
            }, [getValues]);

            return (
              <input
                ref={combineRefs(field('foo'), fooInputRef)}
                type="checkbox"
              />
            );
          };

          render(<Component />);
        });
      });

      describe('number field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: number(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).not.toBe(1);

              // eslint-disable-next-line functional/immutable-data
              fooInputRef.current.value = '1';
              fooInputRef.current.dispatchEvent(new Event('input'));

              expect(getValues().foo).toBe(1);

              done();
            }, [getValues]);

            return (
              <input
                ref={combineRefs(field('foo'), fooInputRef)}
                type="number"
              />
            );
          };

          render(<Component />);
        });
      });

      describe('string field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: string(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).not.toBe('dummy');

              // eslint-disable-next-line functional/immutable-data
              fooInputRef.current.value = 'dummy';
              fooInputRef.current.dispatchEvent(new Event('input'));

              expect(getValues().foo).toBe('dummy');

              done();
            }, [getValues]);

            return (
              <input
                ref={combineRefs<HTMLInputElement>(field('foo'), fooInputRef)}
                type="text"
              />
            );
          };

          render(<Component />);
        });
      });
    });
  });

  describe('getValues()', () => {
    describe('without explicit initial values', () => {
      it('should return correct values', () => {
        const { result } = renderHook(() =>
          useForm({
            fields: {
              foo: boolean(),
              bar: number(),
              baz: string(),
            },
          }),
        );

        expect(result.current.getValues()).toEqual({
          foo: false,
          bar: undefined,
          baz: '',
        });
      });
    });

    describe('with explicit initial values', () => {
      it('should return correct values', () => {
        const { result } = renderHook(() =>
          useForm({
            fields: {
              foo: boolean({ initial: true }),
              bar: number({ initial: 0 }),
              baz: string({ initial: 'baz' }),
            },
          }),
        );

        expect(result.current.getValues()).toEqual({
          foo: true,
          bar: 0,
          baz: 'baz',
        });
      });
    });
  });

  describe('validate()', () => {
    it('should return correct values', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: boolean(),
            bar: number({ validators: [range(1, 10)] }),
            baz: string({ validators: [required()] }),
            foobar: number({
              initial: 1,
              validators: [min(2), max(0)],
            }),
          },
        }),
      );

      act(() => {
        expect(result.current.validate()).toEqual({
          foo: [],
          bar: [],
          baz: [expect.any(String)],
          foobar: [expect.any(String), expect.any(String)],
        });
      });
    });
  });

  describe('handleSubmit()', () => {
    it('should call e.preventDefault()', () => {
      const Component: React.FC = () => {
        const { handleSubmit } = useForm({
          fields: {
            foo: string(),
          },
        });

        return <form data-testid="form" onSubmit={handleSubmit()} />;
      };

      const submitEvent = new Event('submit');
      // eslint-disable-next-line @typescript-eslint/unbound-method, functional/immutable-data
      submitEvent.preventDefault = jest.fn();

      const { getByTestId } = render(<Component />);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(submitEvent.preventDefault).not.toBeCalled();

      getByTestId('form').dispatchEvent(submitEvent);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(submitEvent.preventDefault).toBeCalled();
    });

    it('should call options.onSubmit() with correct payload', () => {
      const onSubmitMock = jest.fn();

      const Component: React.FC = () => {
        const { handleSubmit } = useForm({
          fields: {
            foo: string(),
          },
        });

        return (
          <form data-testid="form" onSubmit={handleSubmit(onSubmitMock)} />
        );
      };

      const { getByTestId } = render(<Component />);

      expect(onSubmitMock).not.toBeCalled();

      fireEvent.submit(getByTestId('form'));

      expect(onSubmitMock).toBeCalledWith({
        foo: expect.any(String),
      });
    });

    it('should not call options.onSubmit() if error detected', () => {
      const onSubmitMock = jest.fn(() => new Promise<void>(() => {}));

      const Component: React.FC = () => {
        const { handleSubmit } = useForm({
          fields: {
            foo: string({
              validators: [required()],
            }),
          },
        });

        return (
          <form data-testid="form" onSubmit={handleSubmit(onSubmitMock)} />
        );
      };

      const { getByTestId } = render(<Component />);

      expect(onSubmitMock).not.toBeCalled();

      fireEvent.submit(getByTestId('form'));

      expect(onSubmitMock).not.toBeCalled();
    });

    it('should focus element which has error', () => {
      const Component: React.FC = () => {
        const { field, handleSubmit } = useForm({
          fields: {
            foo: string(),
            bar: string({
              validators: [required()],
            }),
          },
        });

        return (
          <form data-testid="form" onSubmit={handleSubmit()}>
            <input ref={field('foo')}></input>
            <input data-testid="bar" ref={field('bar')}></input>
          </form>
        );
      };

      const { getByTestId } = render(<Component />);

      expect(document.activeElement).not.toBe(getByTestId('bar'));

      fireEvent.submit(getByTestId('form'));

      expect(document.activeElement).toBe(getByTestId('bar'));
    });

    it('should not call options.onSubmit() if previous submittion is in progress', () => {
      const onSubmitMock = jest.fn(() => new Promise<void>(() => {}));

      const Component: React.FC = () => {
        const { handleSubmit } = useForm({
          fields: {
            foo: string(),
          },
        });

        return (
          <form data-testid="form" onSubmit={handleSubmit(onSubmitMock)} />
        );
      };

      const { getByTestId } = render(<Component />);

      expect(onSubmitMock).not.toBeCalled();

      fireEvent.submit(getByTestId('form'));

      expect(onSubmitMock).toBeCalledTimes(1);

      fireEvent.submit(getByTestId('form'));

      expect(onSubmitMock).toBeCalledTimes(1);
    });

    describe('refinements', () => {
      describe('boolean', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: boolean(),
                bar: boolean({
                  validators: [required()],
                }),
              },
            }),
          );

          result.current.handleSubmit((data) => {
            const expectedData: {
              readonly foo: boolean;
              readonly bar: true;
            } = data;

            expectedData;
          });
        });
      });

      describe('number', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: number(),
                bar: number({
                  validators: [required()],
                }),
              },
            }),
          );

          result.current.handleSubmit((data) => {
            const expectedData: {
              readonly foo: number | undefined;
              readonly bar: number;
            } = data;

            expectedData;
          });
        });
      });
    });
  });

  describe('options.rules', () => {
    it('should validate field value comparing form values', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: number({
              initial: 2,
            }),
            bar: number({
              initial: 0,
              validators: [min(1)],
            }),
          },
          rules: {
            bar: (value, { foo }) => {
              if (value == null || foo == null) {
                return;
              }

              if (value < foo) {
                return new ValidationError(
                  'should be smaller than the value of `foo`.',
                );
              }
            },
          },
        }),
      );

      act(() => {
        expect(result.current.validate()).toEqual({
          foo: [],
          bar: [
            expect.any(String),
            'should be smaller than the value of `foo`.',
          ],
        });
      });
    });
  });
});
