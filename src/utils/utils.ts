import { injectable } from "inversify";

export interface Util {
  isValidPhoneNumber(phoneNumber: string): boolean;
  formatPhone(number: string): string;
  getDomainWithProtocol(value: string): string;
  hiddenName(name: string): string;
}

@injectable()
export class UtilImpl implements Util {
  public isValidPhoneNumber(phoneNumber: string): boolean {
    const reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return !reg.test(phoneNumber);
  }

  public formatPhone(number: string): string {
    if (!number) return number;
    return number.replace(/[^0-9]/g, "");
  }

  public getDomainWithProtocol(value: string): string {
    if (!value) {
      return;
    }

    const match = value.match(/^https?\:\/\/([^\/?#]+)/i);
    if (match && match[0]) {
      return match[0];
    }

    return value;
  }

  public hiddenName(name: string): string {
    return name.replace(/[a-zA-Z]/gi, "#");
  }
}
