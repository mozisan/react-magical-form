declare const ValidationErrorContainerBrand: unique symbol;

class ValidationErrorContainer {
  public static build(message: string): ValidationError {
    return new ValidationErrorContainer(message);
  }

  public static readonly empty = new ValidationErrorContainer();

  public readonly [ValidationErrorContainerBrand]: typeof ValidationErrorContainerBrand;
  public readonly messages: readonly string[];

  private constructor(...messages: readonly string[]) {
    this.messages = messages;
  }

  public concat(other: ValidationErrorContainer): ValidationErrorContainer {
    return new ValidationErrorContainer(...this.messages, ...other.messages);
  }
}

export type ValidationError = ValidationErrorContainer;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ValidationError {
  export const { empty } = ValidationErrorContainer;
}

export const validationError = (message: string) =>
  ValidationErrorContainer.build(message);
