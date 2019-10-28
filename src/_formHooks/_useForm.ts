import { useCallback, useMemo, useRef, useState } from 'react';

import { FieldFactory } from '../_fieldFactories';
import { InputElements } from '../_fields';
import {
  KeyOf,
  mapObject,
  mapValues,
  someValue,
  useLatestRef,
  values,
} from '../_utils';
import { ApplyRefinement, Validator } from '../_validator';

type FormValuesOf<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]: ReturnType<
    ReturnType<TFields[TKey]>['getValue']
  >;
};

type RefinedFieldValuesOf<
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]: ReturnType<
    ReturnType<TFields[TKey]>['dangerouslyGetRefinedValue']
  >;
};

type RefinedFormValuesOf<
  TFields extends Record<string, FieldFactory<any, any, any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TRules extends FormRuleFactoriesOf<TFields, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<RefinedFieldValuesOf<TFields>>]: ApplyRefinement<
    TRules[TKey] extends FormRule<any, Validator<any, infer TRuleRefinement>> // eslint-disable-line @typescript-eslint/no-explicit-any
      ? TRuleRefinement
      : never,
    RefinedFieldValuesOf<TFields>[TKey]
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

type FormRule<
  TFormValues,
  TValidator extends Validator<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = (values: TFormValues) => TValidator | undefined;

type FormRuleFactoriesOf<
  TFields extends Record<string, FieldFactory<any, any, any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TValidators extends Record<KeyOf<TFields>, Validator<any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly [TKey in KeyOf<TFields>]?: FormRule<
    Omit<RefinedFieldValuesOf<TFields>, TKey>,
    TValidators[TKey]
  >;
};

type SubmitHandlerCallbackOf<
  TFields extends Record<string, FieldFactory<any, any, any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TRules extends FormRuleFactoriesOf<TFields, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = (values: RefinedFormValuesOf<TFields, TRules>) => void | Promise<void>;

type Form<
  TFields extends Record<string, FieldFactory<any, any, any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TRules extends FormRuleFactoriesOf<TFields, any> // eslint-disable-line @typescript-eslint/no-explicit-any
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
    handler?: SubmitHandlerCallbackOf<TFields, TRules>,
  ) => (e: React.FormEvent) => void;
  readonly useRules: <TRules extends FormRuleFactoriesOf<TFields, any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
    rules: TRules,
  ) => Omit<Form<TFields, TRules>, 'useRules'>;
};

type Options<
  TFields extends Record<string, FieldFactory<any, any, any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TRules extends FormRuleFactoriesOf<TFields, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly fields: TFields;
  readonly rules?: TRules;
};

const useFormCore = <
  TFields extends Record<string, FieldFactory<any, any, any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TRules extends FormRuleFactoriesOf<TFields, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>({
  fields: fieldFactories,
  rules: ruleFactories,
}: Options<TFields, TRules>): Form<TFields, TRules> => {
  const memoizedFields = useMemo(
    () => mapValues(fieldFactories, (createField, name) => createField(name)),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [errors, setErrors] = useState<FormErrorsOf<TFields>>(
    mapValues(memoizedFields, () => []),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rulesRef = useLatestRef(ruleFactories);
  const isSubmittingRef = useLatestRef(isSubmitting);
  const submitHandlerRef = useRef<(e: React.FormEvent) => void>();
  const submitHandlerCallbackRef = useRef<
    SubmitHandlerCallbackOf<TFields, TRules>
  >();

  const getValues = useCallback(
    (): FormValuesOf<TFields> =>
      mapValues(memoizedFields, (field) => field.getValue()),
    [memoizedFields],
  );

  const getErrors = useCallback((): FormErrorsOf<TFields> => {
    const fieldErrors = mapValues(memoizedFields, (field) => {
      const fieldError = field.validate().getError();
      return fieldError != null ? fieldError.messages : [];
    });

    if (someValue(fieldErrors, (value) => value.length > 0)) {
      return fieldErrors;
    }

    const rules = rulesRef.current;
    if (rules == null) {
      return fieldErrors;
    }

    const refinedFieldValues = getValues();

    return mapValues(fieldErrors, (fieldErrorMessages, fieldName) => {
      const rule = rules[fieldName];
      if (rule == null) {
        return fieldErrorMessages;
      }

      const validate: Validator<any, any> = rule(refinedFieldValues); // eslint-disable-line @typescript-eslint/no-explicit-any
      const ruleError = validate(refinedFieldValues[fieldName]).getError();
      if (ruleError == null) {
        return fieldErrorMessages;
      }

      return fieldErrorMessages.concat(ruleError.messages);
    });
  }, [getValues, memoizedFields, rulesRef]);

  const dangerouslyGetRefinedFormValues = useCallback((): RefinedFormValuesOf<
    TFields,
    TRules
  > => {
    const formErrors = getErrors();

    if (someValue(formErrors, (value) => value.length > 0)) {
      throw new Error(
        'dangerouslyGetRefinedFormValues() called, but validation falied.',
      );
    }

    return (getValues() as unknown) as RefinedFormValuesOf<TFields, TRules>;
  }, [getErrors, getValues]);

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
      (handlerCallback?: SubmitHandlerCallbackOf<TFields, TRules>) => {
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

          const submittion = handler(dangerouslyGetRefinedFormValues());
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
      [
        dangerouslyGetRefinedFormValues,
        isSubmittingRef,
        memoizedFields,
        validate,
      ],
    ),
    useRules: <TRules extends FormRuleFactoriesOf<TFields, any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
      rules: TRules,
    ): Omit<Form<TFields, TRules>, 'useRules'> => {
      const form = useFormCore({
        fields: fieldFactories,
        rules,
      });

      return mapObject(form, ({ useRules, ...params }) => {
        useRules;

        return params;
      });
    },
  };
};

export const useForm = <
  TFields extends Record<string, FieldFactory<any, any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  fields: TFields,
): Form<TFields, never> => useFormCore({ fields });
