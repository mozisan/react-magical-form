export class ValidationError {
  public static readonly empty = new ValidationError();

  public readonly messages: readonly string[];

  public constructor(...messages: readonly string[]) {
    this.messages = messages;
  }

  public isEmpty(): boolean {
    return this.messages.length === 0;
  }

  public concat(other: ValidationError): ValidationError {
    return new ValidationError(...this.messages, ...other.messages);
  }
}
