import { useCallback, useMemo, useRef, useState } from 'react';

import { FieldFactory } from '../_fieldFactories';
import { InputElements } from '../_fields';
import { KeyOf, mapValues, useLatestRef, values } from '../_utils';
import { ValidationError } from '../_validator';

type FormValuesOf<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]: ReturnType<
    ReturnType<TFields[TKey]>['getValue']
  >;
};

type RefinedFormValuesOf<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]: ReturnType<
    ReturnType<TFields[TKey]>['dangerouslyGetRefinedValue']
  >;
};

type FormErrorsOf<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]: readonly string[];
};

const getFirstErrorColumn = <
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
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
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]?: FieldRule<
    ReturnType<ReturnType<TFields[TKey]>['getValue']>,
    Omit<FormValuesOf<TFields>, TKey>
  >;
};

type SubmitHandlerCallbackOf<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = (values: RefinedFormValuesOf<TFields>) => void | Promise<void>;

export type Form<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
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
  readonly clear: () => void;
  readonly clearErrors: () => void;
  readonly handleSubmit: (
    handler?: SubmitHandlerCallbackOf<TFields>,
  ) => (e: React.FormEvent) => void;
};

type Options<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly fields: TFields;
  readonly rules?: FormRulesOf<TFields>;
};

export const useForm = <
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
>({
  fields: fieldFactories,
  rules = {},
}: Options<TFields>): Form<TFields> => {
  const memoizedFields = useMemo(
    () => mapValues(fieldFactories, (createField, name) => createField(name)),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const memoizedRules = useMemo(() => rules, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [errors, setErrors] = useState<FormErrorsOf<TFields>>(
    mapValues(fieldFactories, () => []),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmittingRef = useLatestRef(isSubmitting);
  const submitHandlerRef = useRef<(e: React.FormEvent) => void>();
  const submitHandlerCallbackRef = useRef<SubmitHandlerCallbackOf<TFields>>();

  const getValues = useCallback(
    (): FormValuesOf<TFields> =>
      mapValues(memoizedFields, (field) => field.getValue()),
    [memoizedFields],
  );

  const dangerouslyGetRefinedValues = useCallback(
    (): RefinedFormValuesOf<TFields> =>
      mapValues(memoizedFields, (field) => field.dangerouslyGetRefinedValue()),
    [memoizedFields],
  );

  const getErrors = useCallback((): FormErrorsOf<TFields> => {
    const formValues = getValues();

    return mapValues(memoizedFields, (field, fieldName) => {
      const specError = field.validate().getError() || ValidationError.empty;

      const rule = memoizedRules[fieldName];
      const ruleError =
        (rule && rule(formValues[fieldName], formValues)) ||
        ValidationError.empty;

      return specError.concat(ruleError).messages;
    });
  }, [getValues, memoizedFields, memoizedRules]);

  const resetValues = useCallback((): void => {
    mapValues(memoizedFields, (field) => field.reset());
  }, [memoizedFields]);

  const clearValues = useCallback((): void => {
    mapValues(memoizedFields, (field) => field.clear());
  }, [memoizedFields]);

  const clearErrors = useCallback((): void => {
    setErrors(mapValues(memoizedFields, () => []));
  }, [memoizedFields]);

  const reset = useCallback(() => {
    resetValues();
    clearErrors();
  }, [clearErrors, resetValues]);

  const clear = useCallback(() => {
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
      ) => memoizedFields[name].bindToElement(element),
      [memoizedFields],
    ),
    getValues,
    setValue: useCallback(
      <TFieldName extends KeyOf<TFields>>(
        field: TFieldName,
        value: FormValuesOf<TFields>[TFieldName],
      ): void => memoizedFields[field].setValue(value),
      [memoizedFields],
    ),
    setValues: useCallback(
      (newValues: FormValuesOf<TFields>): void => {
        mapValues(newValues, (value, field) =>
          memoizedFields[field].setValue(value),
        );
      },
      [memoizedFields],
    ),
    validate,
    reset,
    clear,
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
            memoizedFields[firstErrorColumn].focus();
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
      [dangerouslyGetRefinedValues, isSubmittingRef, memoizedFields, validate],
    ),
  };
};
