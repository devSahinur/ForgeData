import type { Random } from "../helpers/random.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DAY_MS = 24 * 60 * 60 * 1000;

export class DateModule {
  constructor(private random: Random) {}

  /** Random date up to `years` years before `refDate` (defaults to now). */
  past(years = 1, refDate: Date = new Date()): Date {
    const end = refDate.getTime();
    const start = end - years * 365 * DAY_MS;
    return new Date(this.random.int(start, end));
  }

  /** Random date up to `years` years after `refDate` (defaults to now). */
  future(years = 1, refDate: Date = new Date()): Date {
    const start = refDate.getTime();
    const end = start + years * 365 * DAY_MS;
    return new Date(this.random.int(start, end));
  }

  /** Random date within the last `days` days before `refDate` (defaults to now). */
  recent(days = 1, refDate: Date = new Date()): Date {
    const end = refDate.getTime();
    const start = end - days * DAY_MS;
    return new Date(this.random.int(start, end));
  }

  /** Random date between `minAge` and `maxAge` years old, relative to `refDate`. */
  birthdate(minAge = 18, maxAge = 65, refDate: Date = new Date()): Date {
    const end = refDate.getTime() - minAge * 365 * DAY_MS;
    const start = refDate.getTime() - maxAge * 365 * DAY_MS;
    return new Date(this.random.int(start, end));
  }

  month(): string {
    return this.random.arrayElement(MONTHS);
  }

  weekday(): string {
    return this.random.arrayElement(WEEKDAYS);
  }

  between(start: Date, end: Date): Date {
    return new Date(this.random.int(start.getTime(), end.getTime()));
  }
}
