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
  readonly spec?: Validator<File | undefined, TRefinement>;
};

export class FileField<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> implements Field<File | undefined, TRefinement, HTMLInputElement> {
  public readonly name: string;
  private element: HTMLInputElement | null = null; // eslint-disable-line functional/prefer-readonly-type
  private value?: File; // eslint-disable-line functional/prefer-readonly-type
  private readonly validateValue: Validator<File | undefined, TRefinement>;
  private readonly updateEvent = 'change';

  public constructor({
    name,
    spec: validator = Validator.Noop,
  }: Options<TRefinement>) {
    this.name = name;
    this.validateValue = validator;
  }

  public bindToElement(element: HTMLInputElement | null): void {
    if (element == null || element === this.element) {
      return;
    }

    if (this.element != null) {
      throw new Error(
        `FileField of \`${this.name}\` cannot be bound to multiple elements.`,
      );
    }

    if (!(element instanceof HTMLInputElement)) {
      throw new Error('FileField can be bound only to HTMLInputElement.');
    }

    const expectedType = 'file';
    if (element.type !== expectedType) {
      throw new Error(
        `FileField can be bound only to HTMLInputElement whose type is \`${expectedType}\`.`,
      );
    }

    if (element.multiple) {
      throw new Error(
        `FileField cannot be bound to HTMLInputElement whose multiple is true.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `FileField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    this.element = element; // eslint-disable-line functional/immutable-data

    this.element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): File | undefined {
    return this.value;
  }

  public setValue(file?: File): void {
    this.value = file; // eslint-disable-line functional/immutable-data
  }

  public validate(): ValidationResult<File | undefined, TRefinement> {
    return this.validateValue(this.getValue());
  }

  public focus(): void {
    if (this.element == null) {
      return;
    }

    this.element.focus();
  }

  public reset(): void {
    this.setValue();
  }

  public clear(): void {
    this.setValue();
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<
    TRefinement,
    File | undefined
  > {
    if (this.validate().isFailed) {
      throw new Error(
        `dangerouslyGetRefinedValue() of FileField for \`${this.name}\` is called, but validation failed.`,
      );
    }

    return this.getValue() as ApplyRefinement<TRefinement, File | undefined>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;
    if (element.files == null) {
      return;
    }

    this.setValue(element.files[0]);
  };
}
