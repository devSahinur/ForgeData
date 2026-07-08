import type { Random } from "../helpers/random.js";

export class PhoneModule {
  constructor(private random: Random) {}

  number(format = "+1-###-###-####"): string {
    return format.replace(/#/g, () => this.random.int(0, 9).toString());
  }

  imei(): string {
    const digits = Array.from({ length: 14 }, () => this.random.int(0, 9));
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let d = digits[i] as number;
      if (i % 2 !== 0) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
    }
    const check = (10 - (sum % 10)) % 10;
    return digits.join("") + check.toString();
  }
}
