import { formatISO, isValid, format, differenceInYears } from "date-fns";

export class DateUtils {
  public static dateOnly(value: Date): string {
    if (!value) {
      return null;
    }
    return isValid(value) ? formatISO(value, { representation: "date" }) : value.toString();
  }

  public static dateTime(value: Date): string {
    return isValid(value) ? value.toISOString() : value.toString();
  }

  public static isValidDate(value: any): boolean {
    return isValid(value);
  }

  public static toString(value: Date) {
    return this.isValidDate(value) ? value.toString() : "";
  }

  public static formatDate(value: Date, dateFormat = "") {
    if (!dateFormat || !this.isValidDate(value)) {
      return "";
    }
    return format(value, dateFormat);
  }

  public static calculateAge(dateOfBirth: Date): number {
    return differenceInYears(Date.now(), dateOfBirth);
  }
}
