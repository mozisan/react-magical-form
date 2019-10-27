import { cleanup, fireEvent, render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import React, { useEffect, useRef } from 'react';

import {
  checkbox,
  file,
  files,
  number,
  numberChoice,
  text,
  textChoice,
} from '../_fieldFactories';
import { combineRefs, expectType } from '../_utils';
import { compose, validationError } from '../_validator';
import { max, min, oneOf, range, required } from '../validators';
import { useForm } from './_useForm';

describe('useForm()', () => {
  afterEach(cleanup);

  it('should avoid redundant re-render', () => {
    const detectReRender = jest.fn();

    const Component: React.FC = () => {
      const params = useForm({
        fields: {
          foo: text(),
        },
      });

      useEffect(() => {
        detectReRender();
      }, Object.values(params)); // eslint-disable-line react-hooks/exhaustive-deps

      return null;
    };

    const rendered = render(<Component />);

    expect(detectReRender).toBeCalledTimes(1);

    rendered.rerender(<Component />);

    expect(detectReRender).toBeCalledTimes(1);
  });

  describe('field()', () => {
    describe('element bindings', () => {
      describe('checkbox field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: checkbox(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).not.toBe(true);

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

      describe('file field', () => {
        it('should update value', (done) => {
          const dummyFile = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
          });

          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: file(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).toBe(undefined);

              fireEvent.change(fooInputRef.current, {
                target: {
                  files: [dummyFile],
                },
              });

              expect(getValues().foo).toBe(dummyFile);

              done();
            }, [getValues]);

            return (
              <input ref={combineRefs(field('foo'), fooInputRef)} type="file" />
            );
          };

          render(<Component />);
        });
      });

      describe('files field', () => {
        it('should update value', (done) => {
          const dummyFile = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
          });

          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: files(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).toEqual([]);

              fireEvent.change(fooInputRef.current, {
                target: {
                  files: [dummyFile],
                },
              });

              expect(getValues().foo).toEqual([dummyFile]);

              done();
            }, [getValues]);

            return (
              <input
                ref={combineRefs(field('foo'), fooInputRef)}
                type="file"
                multiple
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

      describe('numberChoice field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooOfBarInputRef = useRef<HTMLInputElement>(null);
            const fooOfBazInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: numberChoice(),
              },
            });

            useEffect(() => {
              if (
                fooOfBarInputRef.current == null ||
                fooOfBazInputRef.current == null
              ) {
                throw new Error();
              }

              expect(getValues().foo).toBe(undefined);

              fooOfBarInputRef.current.click();

              expect(getValues().foo).toBe(1);

              fooOfBazInputRef.current.click();

              expect(getValues().foo).toBe(2);

              done();
            }, [getValues]);

            return (
              <>
                <input
                  ref={combineRefs(field('foo'), fooOfBarInputRef)}
                  type="radio"
                  name="foo"
                  value="1"
                />
                <input
                  ref={combineRefs(field('foo'), fooOfBazInputRef)}
                  type="radio"
                  name="foo"
                  value="2"
                />
              </>
            );
          };

          render(<Component />);
        });
      });

      describe('text field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: text(),
              },
            });

            useEffect(() => {
              if (fooInputRef.current == null) {
                throw new Error();
              }

              expect(getValues().foo).not.toBe('dummy');

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

      describe('textChoice field', () => {
        it('should update value', (done) => {
          const Component: React.FC = () => {
            const fooOfBarInputRef = useRef<HTMLInputElement>(null);
            const fooOfBazInputRef = useRef<HTMLInputElement>(null);

            const { field, getValues } = useForm({
              fields: {
                foo: textChoice(),
              },
            });

            useEffect(() => {
              if (
                fooOfBarInputRef.current == null ||
                fooOfBazInputRef.current == null
              ) {
                throw new Error();
              }

              expect(getValues().foo).toBe(undefined);

              fooOfBarInputRef.current.click();

              expect(getValues().foo).toBe('bar');

              fooOfBazInputRef.current.click();

              expect(getValues().foo).toBe('baz');

              done();
            }, [getValues]);

            return (
              <>
                <input
                  ref={combineRefs(field('foo'), fooOfBarInputRef)}
                  type="radio"
                  name="foo"
                  value="bar"
                />
                <input
                  ref={combineRefs(field('foo'), fooOfBazInputRef)}
                  type="radio"
                  name="foo"
                  value="baz"
                />
              </>
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
              foo: checkbox(),
              bar: number(),
              baz: text(),
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
              foo: checkbox({ initial: true }),
              bar: number({ initial: 0 }),
              baz: text({ initial: 'baz' }),
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
            foo: checkbox(),
            bar: number({ spec: range(1, 10) }),
            baz: text({ spec: required() }),
            foobar: number({
              initial: 1,
              spec: compose(
                min(2),
                max(0),
              ),
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
            foo: text(),
          },
        });

        return <form data-testid="form" onSubmit={handleSubmit()} />;
      };

      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn(); // eslint-disable-line @typescript-eslint/unbound-method, functional/immutable-data

      const { getByTestId } = render(<Component />);

      expect(submitEvent.preventDefault).not.toBeCalled(); // eslint-disable-line @typescript-eslint/unbound-method

      getByTestId('form').dispatchEvent(submitEvent);

      expect(submitEvent.preventDefault).toBeCalled(); // eslint-disable-line @typescript-eslint/unbound-method
    });

    it('should call options.onSubmit() with correct payload', () => {
      const onSubmitMock = jest.fn();

      const Component: React.FC = () => {
        const { handleSubmit } = useForm({
          fields: {
            foo: text(),
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
        foo: '',
      });
    });

    it('should not call options.onSubmit() if error detected', () => {
      const onSubmitMock = jest.fn(() => new Promise<void>(() => {}));

      const Component: React.FC = () => {
        const { handleSubmit } = useForm({
          fields: {
            foo: text({
              spec: required(),
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
            foo: text(),
            bar: text({
              spec: required(),
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
            foo: text(),
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
      describe('checkbox', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: checkbox(),
                bar: checkbox({
                  spec: required(),
                }),
              },
            }),
          );

          const values = result.current.getValues();
          expectType<typeof values>()
            .as<{
              readonly foo: boolean;
              readonly bar: boolean;
            }>()
            .assert();

          result.current.handleSubmit((data) => {
            expectType<typeof data>()
              .as<{
                readonly foo: boolean;
                readonly bar: true;
              }>()
              .assert();
          });
        });
      });

      describe('file', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: file(),
                bar: file({
                  spec: required(),
                }),
              },
            }),
          );

          const values = result.current.getValues();
          expectType<typeof values>()
            .as<{
              readonly foo: File | undefined;
              readonly bar: File | undefined;
            }>()
            .assert();

          result.current.handleSubmit((data) => {
            expectType<typeof data>()
              .as<{
                readonly foo: File | undefined;
                readonly bar: File;
              }>()
              .assert();
          });
        });
      });

      describe('files', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: files(),
                bar: files({
                  spec: required(),
                }),
              },
            }),
          );

          const values = result.current.getValues();
          expectType<typeof values>()
            .as<{
              readonly foo: readonly File[];
              readonly bar: readonly File[];
            }>()
            .assert();

          result.current.handleSubmit((data) => {
            expectType<typeof data>()
              .as<{
                readonly foo: readonly File[];
                readonly bar: readonly [File, ...readonly File[]];
              }>()
              .assert();
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
                  spec: required(),
                }),
              },
            }),
          );

          const values = result.current.getValues();
          expectType<typeof values>()
            .as<{
              readonly foo: number | undefined;
              readonly bar: number | undefined;
            }>()
            .assert();

          result.current.handleSubmit((data) => {
            expectType<typeof data>()
              .as<{
                readonly foo: number | undefined;
                readonly bar: number;
              }>()
              .assert();
          });
        });
      });

      describe('numberChoice', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: numberChoice({
                  spec: required(),
                }),
                bar: numberChoice({
                  spec: compose(
                    required(),
                    oneOf(1, 2),
                  ),
                }),
              },
            }),
          );

          const values = result.current.getValues();
          expectType<typeof values>()
            .as<{
              readonly foo: number | undefined;
              readonly bar: number | undefined;
            }>()
            .assert();

          result.current.handleSubmit((data) => {
            expectType<typeof data>()
              .as<{
                readonly foo: number;
                readonly bar: 1 | 2;
              }>()
              .assert();
          });
        });
      });

      describe('textChoice', () => {
        it('should refinement types correctly', () => {
          const { result } = renderHook(() =>
            useForm({
              fields: {
                foo: textChoice({
                  spec: required(),
                }),
                bar: textChoice({
                  spec: compose(
                    required(),
                    oneOf('a', 'b'),
                  ),
                }),
              },
            }),
          );

          const values = result.current.getValues();
          expectType<typeof values>()
            .as<{
              readonly foo: string | undefined;
              readonly bar: string | undefined;
            }>()
            .assert();

          result.current.handleSubmit((data) => {
            expectType<typeof data>()
              .as<{
                readonly foo: string;
                readonly bar: 'a' | 'b';
              }>()
              .assert();
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
              spec: min(1),
            }),
          },
          rules: {
            bar: (value, { foo }) => {
              if (value == null || foo == null) {
                return;
              }

              if (value < foo) {
                return validationError(
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
