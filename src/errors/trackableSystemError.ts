export class TrackableSystemError extends Error {
  public readonly className: string;
  public readonly functionName: string;

  constructor(className: string, functionName: string, message: string) {
    // Call parent constructor
    super(message);

    // Saving class name in the property of our custom error as a shortcut
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // Custom properties
    this.className = className;
    this.functionName = functionName;
  }
}
