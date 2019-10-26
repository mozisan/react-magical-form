import {
  ApplyRefinement,
  Refinement,
  ValidationResult,
  Validator,
} from '../_validator';
import { Field } from './_field';

export type Options<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly name: string;
  readonly initial?: number;
  readonly spec?: Validator<number | undefined, TRefinement>;
};

export class NumberField<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> implements Field<number | undefined, TRefinement, HTMLInputElement> {
  public readonly name: string;
  private element: HTMLInputElement | null = null; // eslint-disable-line functional/prefer-readonly-type
  private readonly initialValue?: number;
  private value?: number; // eslint-disable-line functional/prefer-readonly-type
  private readonly validateValue: Validator<number | undefined, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({
    name,
    initial: initialValue,
    spec: validator = Validator.Noop,
  }: Options<TRefinement>) {
    this.name = name;
    this.initialValue = initialValue;
    this.value = initialValue;
    this.validateValue = validator;
  }

  public bindToElement(element: HTMLInputElement | null): void {
    if (element == null || element === this.element) {
      return;
    }

    if (this.element != null) {
      throw new Error(
        `NumberField of \`${this.name}\` cannot be bound to multiple elements.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `NumberField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    this.element = element; // eslint-disable-line functional/immutable-data

    if (this.value != null) {
      this.setValue(this.value);
    }

    this.element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): number | undefined {
    return this.value;
  }

  public setValue(value: number | undefined): void {
    const nanCoercedValue =
      value != null && Number.isNaN(value) ? undefined : value;

    this.value = nanCoercedValue; // eslint-disable-line functional/immutable-data

    if (this.element == null) {
      return;
    }

    this.element.value = nanCoercedValue != null ? `${value}` : ''; // eslint-disable-line functional/immutable-data
  }

  public validate(): ValidationResult<number | undefined, TRefinement> {
    return this.validateValue(this.getValue());
  }

  public focus(): void {
    if (this.element == null) {
      return;
    }

    this.element.focus();
  }

  public reset(): void {
    this.setValue(this.initialValue);
  }

  public clear(): void {
    this.setValue(undefined);
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<
    TRefinement,
    number | undefined
  > {
    if (this.validate().isFailed) {
      throw new Error(
        `dangerouslyGetRefinedValue() of NumberField for \`${this.name}\` is called, but validation failed.`,
      );
    }

    return this.getValue() as ApplyRefinement<TRefinement, number | undefined>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(Number(element.value));
  };
}
