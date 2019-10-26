import {
  ApplyRefinement,
  Refinement,
  ValidationResult,
  Validator,
} from '../_validator';
import { Field } from './_field';

export type Options<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
> = {
  readonly name: string;
  readonly initial?: boolean;
  readonly spec?: Validator<boolean, TRefinement>;
};

export class CheckboxField<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
> implements Field<boolean, TRefinement, HTMLInputElement> {
  public readonly name: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  private element: HTMLInputElement | null = null;
  private readonly initialValue: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  private value: boolean;
  private readonly validateValue: Validator<boolean, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({
    name,
    initial: initialValue = false,
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
        `CheckboxField of \`${this.name}\` cannot be bound to multiple elements.`,
      );
    }

    if (!(element instanceof HTMLInputElement)) {
      throw new Error('CheckboxField can be bound only to HTMLInputElement.');
    }

    const expectedType = 'checkbox';
    if (element.type !== expectedType) {
      throw new Error(
        `CheckboxField can be bound only to HTMLInputElement which type is \`${expectedType}\`.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `CheckboxField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    // eslint-disable-next-line functional/immutable-data
    this.element = element;

    if (this.value != null) {
      this.setValue(this.value);
    }

    this.element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): boolean {
    return this.value;
  }

  public setValue(value: boolean): void {
    // eslint-disable-next-line functional/immutable-data
    this.value = value;

    if (this.element == null) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    this.element.checked = value;
  }

  public validate(): ValidationResult<boolean, TRefinement> {
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
    this.setValue(false);
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<TRefinement, boolean> {
    const result = this.validate();
    if (result.type === 'failed') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, boolean>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(element.checked);
  };
}
