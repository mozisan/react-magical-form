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
  readonly spec?: Validator<readonly File[], TRefinement>;
};

export class FilesField<
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> implements Field<readonly File[], TRefinement, HTMLInputElement> {
  public readonly name: string;
  private element: HTMLInputElement | null = null; // eslint-disable-line functional/prefer-readonly-type
  private value: readonly File[] = []; // eslint-disable-line functional/prefer-readonly-type
  private readonly validateValue: Validator<readonly File[], TRefinement>;
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
        `FilesField of \`${this.name}\` cannot be bound to multiple elements.`,
      );
    }

    if (!(element instanceof HTMLInputElement)) {
      throw new Error('FilesField can be bound only to HTMLInputElement.');
    }

    const expectedType = 'file';
    if (element.type !== expectedType) {
      throw new Error(
        `FilesField can be bound only to HTMLInputElement whose type is \`${expectedType}\`.`,
      );
    }

    if (!element.multiple) {
      throw new Error(
        `FilesField cannot be bound to HTMLInputElement whose multiple is not set to true.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `FilesField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    this.element = element; // eslint-disable-line functional/immutable-data

    this.element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): readonly File[] {
    return this.value;
  }

  public setValue(files: readonly File[]): void {
    this.value = files; // eslint-disable-line functional/immutable-data
  }

  public validate(): ValidationResult<readonly File[], TRefinement> {
    return this.validateValue(this.getValue());
  }

  public focus(): void {
    if (this.element == null) {
      return;
    }

    this.element.focus();
  }

  public reset(): void {
    this.setValue([]);
  }

  public clear(): void {
    this.setValue([]);
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<
    TRefinement,
    readonly File[]
  > {
    if (this.validate().isFailed) {
      throw new Error(
        `dangerouslyGetRefinedValue() of FilesField for \`${this.name}\` is called, but validation failed.`,
      );
    }

    return this.getValue() as ApplyRefinement<TRefinement, readonly File[]>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;
    if (element.files == null) {
      return;
    }

    this.setValue(Array.from(element.files));
  };
}
