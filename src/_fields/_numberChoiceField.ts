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

export class NumberChoiceField<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> implements Field<number | undefined, TRefinement, HTMLInputElement> {
  public readonly name: string;
  private elements: readonly HTMLInputElement[] = []; // eslint-disable-line functional/prefer-readonly-type
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
    if (element == null || this.elements.find((e) => e === element) != null) {
      return;
    }

    const expectedType = 'radio';
    if (element.type !== expectedType) {
      throw new Error(
        `NumberChoiceField can be bound only to HTMLInputElement which type is \`${expectedType}\`.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `NumberChoiceField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    if (this.elements.find(({ value }) => value === element.value) != null) {
      throw new Error(
        `NumberChoiceField of \`${this.name}\` can not be bound to element whose value is \`${element.value}\` multiply.`,
      );
    }

    this.elements = [...this.elements, element]; // eslint-disable-line functional/immutable-data

    if (this.value != null) {
      this.setValue(this.value);
    }

    element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): number | undefined {
    return this.value;
  }

  public setValue(value?: number): void {
    const nanCoercedValue =
      value != null && Number.isNaN(value) ? undefined : value;

    this.value = nanCoercedValue; // eslint-disable-line functional/immutable-data

    this.elements.forEach((element) => {
      element.checked = element.value === `${nanCoercedValue}`; // eslint-disable-line functional/immutable-data
    });
  }

  public validate(): ValidationResult<number | undefined, TRefinement> {
    return this.validateValue(this.getValue());
  }

  public focus(): void {
    const [element] = this.elements;
    if (element == null) {
      return;
    }

    element.focus();
  }

  public reset(): void {
    this.setValue(this.initialValue);
  }

  public clear(): void {
    this.setValue();
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<
    TRefinement,
    number | undefined
  > {
    const result = this.validate();
    if (result.type === 'failed') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, number | undefined>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(Number(element.value));
  };
}
