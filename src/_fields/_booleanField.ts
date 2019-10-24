import {
  ApplyRefinement,
  composeValidators,
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
  readonly validators?: readonly Validator<boolean, TRefinement>[];
};

export class BooleanField<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
> implements Field<boolean, HTMLInputElement, TRefinement> {
  public readonly name: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  private element: HTMLInputElement | null = null;
  // eslint-disable-next-line functional/prefer-readonly-type
  private value: boolean;
  private readonly validateValue: Validator<boolean, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({
    name,
    initial = false,
    validators = [],
  }: Options<TRefinement>) {
    this.name = name;
    this.value = initial;
    this.validateValue = composeValidators(validators);
  }

  public bindToElement(element: HTMLInputElement | null): void {
    if (element == null) {
      return;
    }

    if (!(element instanceof HTMLInputElement)) {
      throw new Error('BooleanField can be bound only to HTMLInputElement.');
    }

    const expectedType = 'checkbox';
    if (element.type !== expectedType) {
      throw new Error(
        `BooleanField can be bound only to HTMLInputElement which type is \`${expectedType}\`.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `BooleanField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
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

  public validate(): ValidationResult<boolean> {
    return this.validateValue(this.getValue());
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
    this.element.checked = false;
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<TRefinement, boolean> {
    const result = this.validate();
    if (result.type === 'error') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, boolean>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(element.checked);
  };
}
