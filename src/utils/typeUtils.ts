import { TrackableSystemError } from "errors/trackableSystemError";
import { injectable } from "inversify";

export interface TypeUtils {
  toBoolean(booleanStr: string | boolean): boolean;
  formatString(value: string, variables: any): string;
  randomNumber(length: number): string;
  randomString(length: number): string;
  sleep(seconds: number): void;
  formatHRTime(hrtime: number[]): string;
  mysqlRealEscapeString(value: string): string;
}

@injectable()
export class TypeUtilsImpl implements TypeUtils {
  public toBoolean(booleanStr: string | boolean): boolean {
    if (booleanStr === undefined) {
      return undefined;
    }

    if (typeof booleanStr === "boolean") {
      return booleanStr;
    }

    if (booleanStr === "true") {
      return true;
    }

    if (booleanStr === "false") {
      return false;
    }

    if (booleanStr === "1") {
      return true;
    }

    if (booleanStr === "0") {
      return false;
    }

    throw new TrackableSystemError(
      "TypeUtils",
      "toBoolean",
      `Cannot convert to boolean: ${booleanStr}, type: ${typeof booleanStr}`,
    );
  }

  public formatString(value: string, variables: any): string {
    if (!value) {
      return "";
    }

    return value.replace(/(\{\w+\})/g, (match: string) => {
      if (!variables) {
        return "";
      }

      const text = match.replace(/\{|\}/g, "");
      return variables[text] || "";
    });
  }

  public randomNumber(length: number): string {
    let text = "";
    const possible = "0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  public randomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  public sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  /**
   *
   * @param hrtime [seconds, nanoseconds]
   */
  public formatHRTime(hrtime: number[]): string {
    if (!hrtime) {
      return "N/A";
    }

    const seconds = hrtime[0];
    const nanoseconds = hrtime[1];

    return new Date(seconds * 1000 + nanoseconds / 1000000).toISOString().slice(11, -1);
  }

  public mysqlRealEscapeString(value: string): string {
    if (typeof value === "number") {
      return value;
    }

    if (!value) {
      return "NULL";
    }

    return value.toString().replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char: any) => {
      switch (char) {
        case "\0":
          return "\\0";
        case "\x08":
          return "\\b";
        case "\x09":
          return "\\t";
        case "\x1a":
          return "\\z";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case '"':
        case "'":
        case "\\":
        case "%":
          return "\\" + char;
      }
    });
  }
}
