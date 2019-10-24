import { useCallback, useMemo, useRef, useState } from 'react';

import { FieldFactory } from './_fieldFactories';
import { InputElements } from './_fields';
import { KeyOf, mapValues, useLatestRef, values } from './_utilities';
import { ValidationError } from './_validator';

type FormValuesOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
> = {
  readonly [TKey in KeyOf<TFields>]: ReturnType<
    ReturnType<TFields[TKey]>['getValue']
  >;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefinedFormValuesOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
> = {
  readonly [TKey in KeyOf<TFields>]: ReturnType<
    ReturnType<TFields[TKey]>['dangerouslyGetRefinedValue']
  >;
};

type FormErrorsOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
> = {
  readonly [TKey in KeyOf<TFields>]: readonly string[];
};

const getFirstErrorColumn = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
>(
  errors: FormErrorsOf<TFields>,
): KeyOf<TFields> | undefined => {
  const found = values(
    mapValues(
      errors,
      (columnErrors: readonly string[], column: KeyOf<TFields>) => ({
        column,
        columnErrors,
      }),
    ),
  ).find(({ columnErrors }) => columnErrors.length > 0);

  return found && found.column;
};

type FieldRule<TFieldValue, TFormValue> = (
  fieldValue: TFieldValue,
  formValues: TFormValue,
) => ValidationError | undefined;

type FormRulesOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
> = {
  readonly [TKey in KeyOf<TFields>]?: FieldRule<
    ReturnType<ReturnType<TFields[TKey]>['getValue']>,
    Omit<FormValuesOf<TFields>, TKey>
  >;
};

type SubmitHandlerCallbackOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
> = (values: RefinedFormValuesOf<TFields>) => void | Promise<void>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Form<TFields extends Record<string, FieldFactory<any, any, any>>> = {
  readonly errors: FormErrorsOf<TFields>;
  readonly isSubmitting: boolean;
  readonly field: <TName extends KeyOf<TFields>>(
    name: TName,
  ) => ReturnType<TFields[TName]>['bindToElement'];
  readonly getValues: () => FormValuesOf<TFields>;
  readonly setValue: <TFieldName extends KeyOf<TFields>>(
    field: TFieldName,
    value: FormValuesOf<TFields>[TFieldName],
  ) => void;
  readonly setValues: (values: FormValuesOf<TFields>) => void;
  readonly validate: () => FormErrorsOf<TFields>;
  readonly reset: () => void;
  readonly clearErrors: () => void;
  readonly handleSubmit: (
    handler?: SubmitHandlerCallbackOf<TFields>,
  ) => (e: React.FormEvent) => void;
};

type Options<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
> = {
  readonly fields: TFields;
  readonly rules?: FormRulesOf<TFields>;
};

export const useForm = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFields extends Record<string, FieldFactory<any, any, any>>
>({
  fields: fieldFactories,
  rules = {},
}: Options<TFields>): Form<TFields> => {
  const [errors, setErrors] = useState<FormErrorsOf<TFields>>(
    mapValues(fieldFactories, () => []),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmittingRef = useLatestRef(isSubmitting);
  const submitHandlerRef = useRef<(e: React.FormEvent) => void>();
  const submitHandlerCallbackRef = useRef<SubmitHandlerCallbackOf<TFields>>();

  const fields = useMemo(
    () => mapValues(fieldFactories, (createField, name) => createField(name)),
    [fieldFactories],
  );

  const getValues = useCallback(
    (): FormValuesOf<TFields> => mapValues(fields, (field) => field.getValue()),
    [fields],
  );

  const dangerouslyGetRefinedValues = useCallback(
    (): RefinedFormValuesOf<TFields> =>
      mapValues(fields, (field) => field.dangerouslyGetRefinedValue()),
    [fields],
  );

  const getErrors = useCallback((): FormErrorsOf<TFields> => {
    const formValues = getValues();

    return mapValues(fields, (field, fieldName) => {
      const rule = rules[fieldName];

      return [
        field.validate().getError() || ValidationError.empty,
        (rule && rule(formValues[fieldName], formValues)) ||
          ValidationError.empty,
      ].reduce((a, b) => a.concat(b)).messages;
    });
  }, [fields, getValues, rules]);

  const clearValues = useCallback((): void => {
    mapValues(fields, (field) => field.clear());
  }, [fields]);

  const clearErrors = useCallback((): void => {
    setErrors(mapValues(fields, () => []));
  }, [fields]);

  const reset = useCallback(() => {
    clearValues();
    clearErrors();
  }, [clearErrors, clearValues]);

  const validate = useCallback(() => {
    const detectedErrors = getErrors();
    setErrors(detectedErrors);

    return detectedErrors;
  }, [getErrors]);

  return {
    errors,
    isSubmitting,
    field: useCallback(
      <TName extends KeyOf<TFields>>(name: TName) => (
        element: InputElements | null,
      ) => fields[name].bindToElement(element),
      [fields],
    ),
    getValues,
    setValue: useCallback(
      <TFieldName extends KeyOf<TFields>>(
        field: TFieldName,
        value: FormValuesOf<TFields>[TFieldName],
      ): void => fields[field].setValue(value),
      [fields],
    ),
    setValues: useCallback(
      (newValues: FormValuesOf<TFields>): void => {
        mapValues(newValues, (value, field) => fields[field].setValue(value));
      },
      [fields],
    ),
    validate,
    reset,
    clearErrors,
    handleSubmit: useCallback(
      (handlerCallback?: SubmitHandlerCallbackOf<TFields>) => {
        submitHandlerCallbackRef.current = handlerCallback;

        if (submitHandlerRef.current != null) {
          return submitHandlerRef.current;
        }

        return (submitHandlerRef.current = (e: React.FormEvent) => {
          e.preventDefault();

          if (isSubmittingRef.current) {
            return;
          }

          const firstErrorColumn = getFirstErrorColumn(validate());
          if (firstErrorColumn != null) {
            fields[firstErrorColumn].focus();
            return;
          }

          setIsSubmitting(true);

          const handler = submitHandlerCallbackRef.current;
          if (handler == null) {
            setIsSubmitting(false);
            return;
          }

          const submittion = handler(dangerouslyGetRefinedValues());
          if (!(submittion instanceof Promise)) {
            setIsSubmitting(false);
            return;
          }

          submittion.then(
            () => {
              setIsSubmitting(false);
            },
            (error) => {
              setIsSubmitting(false);
              return Promise.reject(error);
            },
          );
        });
      },
      [dangerouslyGetRefinedValues, fields, isSubmittingRef, validate],
    ),
  };
};
