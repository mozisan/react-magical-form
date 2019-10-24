import {
  ApplyRefinement,
  composeValidators,
  Refinement,
  ValidationResult,
  Validator,
} from '../_validator';
import { Field } from './_field';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Options<TRefinement extends Refinement<any, any>> = {
  readonly name: string;
  readonly initial?: number;
  readonly validators?: readonly Validator<number | undefined, TRefinement>[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class NumberField<TRefinement extends Refinement<any, any>>
  implements Field<number | undefined, HTMLInputElement, TRefinement> {
  public readonly name: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  private element: HTMLInputElement | null = null;
  // eslint-disable-next-line functional/prefer-readonly-type
  private value?: number;
  private readonly validator: Validator<number | undefined, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({ name, initial, validators = [] }: Options<TRefinement>) {
    this.name = name;
    this.value = initial;
    this.validator = composeValidators(validators);
  }

  public bindToElement(element: HTMLInputElement | null): void {
    if (element == null || element === this.element) {
      return;
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

    if (this.element != null) {
      this.element.removeEventListener(this.updateEvent, this.handleUpdate);
    }

    // eslint-disable-next-line functional/immutable-data
    this.element = element;

    if (this.value != null) {
      this.setValue(this.value);
    }

    this.element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): number | undefined {
    return this.value;
  }

  public setValue(value: number | undefined): void {
    const nanCoercedValue = value != null && isNaN(value) ? undefined : value;

    // eslint-disable-next-line functional/immutable-data
    this.value = nanCoercedValue;

    if (this.element == null) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    this.element.value = nanCoercedValue != null ? `${value}` : '';
  }

  public validate(): ValidationResult<number | undefined, TRefinement> {
    return this.validator(this.getValue());
  }

  public focus(): void {
    if (this.element == null) {
      return;
    }

    this.element.focus();
  }

  public clear(): void {
    if (this.element == null) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    this.element.value = '';
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<
    TRefinement,
    number | undefined
  > {
    const result = this.validate();
    if (result.type === 'error') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, number | undefined>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(Number(element.value));
  };
}
