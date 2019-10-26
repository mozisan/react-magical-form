import {
  ApplyRefinement,
  Refinement,
  ValidationResult,
  Validator,
} from '../_validator';
import { Field, InputElements } from './_field';

export type Options<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly name: string;
  readonly initial?: string;
  readonly spec?: Validator<string, TRefinement>;
};

export class TextField<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> implements Field<string, TRefinement, InputElements> {
  public readonly name: string;
  private element: InputElements | null = null; // eslint-disable-line functional/prefer-readonly-type
  private readonly initialValue: string;
  private value: string; // eslint-disable-line functional/prefer-readonly-type
  private readonly validateValue: Validator<string, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({
    name,
    initial: initialValue = '',
    spec: validator = Validator.Noop,
  }: Options<TRefinement>) {
    this.name = name;
    this.initialValue = initialValue;
    this.value = initialValue;
    this.validateValue = validator;
  }

  public bindToElement(element: InputElements | null): void {
    if (element == null || element === this.element) {
      return;
    }

    if (this.element != null) {
      throw new Error(
        `TextField of \`${this.name}\` cannot be bound to multiple elements.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `TextField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    this.element = element; // eslint-disable-line functional/immutable-data

    if (this.value != null) {
      this.setValue(this.value);
    }

    this.element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value; // eslint-disable-line functional/immutable-data

    if (this.element == null) {
      return;
    }

    this.element.value = value; // eslint-disable-line functional/immutable-data
  }

  public validate(): ValidationResult<string, TRefinement> {
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
    this.setValue('');
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<TRefinement, string> {
    const result = this.validate();
    if (result.type === 'failed') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, string>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as InputElements;

    this.setValue(element.value);
  };
}
