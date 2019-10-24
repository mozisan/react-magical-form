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
  readonly initial?: string;
  readonly validators?: readonly Validator<string | undefined, TRefinement>[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RadioboxField<TRefinement extends Refinement<any, any>>
  implements Field<string | undefined, HTMLInputElement, TRefinement> {
  public readonly name: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  private elements: readonly HTMLInputElement[] = [];
  private readonly initialValue: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  private value?: string;
  private readonly validateValue: Validator<string | undefined, TRefinement>;
  private readonly updateEvent = 'input';

  public constructor({
    name,
    initial = '',
    validators = [],
  }: Options<TRefinement>) {
    this.name = name;
    this.initialValue = initial;
    this.value = initial;
    this.validateValue = composeValidators(validators);
  }

  public bindToElement(element: HTMLInputElement | null): void {
    if (element == null || this.elements.find((e) => e === element) != null) {
      return;
    }

    const expectedType = 'radio';
    if (element.type !== expectedType) {
      throw new Error(
        `RadioboxField can be bound only to HTMLInputElement which type is \`${expectedType}\`.`,
      );
    }

    if (
      element.name != null &&
      element.name !== '' &&
      element.name !== this.name
    ) {
      throw new Error(
        `RadioboxField of \`${this.name}\` can not be bound to element whose name is \`${element.name}\``,
      );
    }

    if (this.elements.find(({ value }) => value === element.value) != null) {
      throw new Error(
        `RadioboxField of \`${this.name}\` can not be bound to element whose value is \`${element.value}\` multiply.`,
      );
    }

    // eslint-disable-next-line functional/immutable-data
    this.elements = [...this.elements, element];

    if (this.value != null) {
      this.setValue(this.value);
    }

    element.addEventListener(this.updateEvent, this.handleUpdate);
  }

  public getValue(): string | undefined {
    return this.value;
  }

  public setValue(value?: string): void {
    // eslint-disable-next-line functional/immutable-data
    this.value = value;

    this.elements.forEach((element) => {
      // eslint-disable-next-line functional/immutable-data
      element.checked = element.value === value;
    });
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
    const result = this.validate();
    if (result.type === 'error') {
      throw new Error();
    }

    return this.getValue() as ApplyRefinement<TRefinement, string | undefined>;
  }

  private readonly handleUpdate = (e: Event) => {
    const element = e.target as HTMLInputElement;

    this.setValue(element.value);
  };
}
