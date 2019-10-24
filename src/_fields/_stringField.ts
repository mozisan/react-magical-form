import {
  ApplyRefinement,
  composeValidators,
  Refinement,
  ValidationResult,
  Validator,
} from '../_validator';
import { Field, InputElements } from './_field';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Options<TRefinement extends Refinement<any, any>> = {
  readonly name: string;
  readonly initial?: string;
  readonly validators?: readonly Validator<string, TRefinement>[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class StringField<TRefinement extends Refinement<any, any>>
  implements Field<string, InputElements, TRefinement> {
  public readonly name: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  private element: InputElements | null = null;
  // eslint-disable-next-line functional/prefer-readonly-type
  private value: string;
  private readonly validateValue: Validator<string, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({
    name,
    initial = '',
    validators = [],
  }: Options<TRefinement>) {
    this.name = name;
    this.value = initial;
    this.validateValue = composeValidators(validators);
  }

  public bindToElement(element: InputElements | null): void {
    if (element == null || element === this.element) {
      return;
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `StringField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
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

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    // eslint-disable-next-line functional/immutable-data
    this.value = value;

    if (this.element == null) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    this.element.value = value;
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

  public clear(): void {
    if (this.element == null) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    this.element.value = '';
  }

  public dangerouslyGetRefinedValue(): ApplyRefinement<TRefinement, string> {
    const result = this.validate();
    if (result.type === 'error') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, string>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as InputElements;

    this.setValue(element.value);
  };
}
