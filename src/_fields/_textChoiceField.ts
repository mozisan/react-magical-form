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
  readonly initial?: string;
  readonly spec?: Validator<string | undefined, TRefinement>;
};

export class TextChoiceField<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> implements Field<string | undefined, TRefinement, HTMLInputElement> {
  public readonly name: string;
  private elements: readonly HTMLInputElement[] = []; // eslint-disable-line functional/prefer-readonly-type
  private readonly initialValue?: string;
  private value?: string; // eslint-disable-line functional/prefer-readonly-type
  private readonly validateValue: Validator<string | undefined, TRefinement>;
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
        `TextChoiceField can be bound only to HTMLInputElement whose type is \`${expectedType}\`.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `TextChoiceField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    if (this.elements.find(({ value }) => value === element.value) != null) {
      throw new Error(
        `TextChoiceField of \`${this.name}\` can not be bound to element whose value is \`${element.value}\` multiply.`,
      );
    }

    this.elements = [...this.elements, element]; // eslint-disable-line functional/immutable-data

    if (this.value != null) {
      this.setValue(this.value);
    }

    element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): string | undefined {
    const checkedElement = this.elements.find((element) => element.checked);
    if (checkedElement == null) {
      return;
    }

    return this.value;
  }

  public setValue(value?: string): void {
    this.elements.forEach((element) => {
      element.checked = element.value === value; // eslint-disable-line functional/immutable-data
    });

    const checkedElement = this.elements.find((element) => element.checked);
    this.value = checkedElement != null ? value : undefined; // eslint-disable-line functional/immutable-data
  }

  public validate(): ValidationResult<string | undefined, TRefinement> {
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
    string | undefined
  > {
    if (this.validate().isFailed) {
      throw new Error(
        `dangerouslyGetRefinedValue() of TextChoiceField for \`${this.name}\` is called, but validation failed.`,
      );
    }

    return this.getValue() as ApplyRefinement<TRefinement, string | undefined>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(element.value);
  };
}
