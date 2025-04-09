export class MathHelpers {
  static addPercent(num: number, percent: number): number {
    return num * (1 + percent / 100);
  }

  static round(num: number): number {
    return Math.round(num);
  }

  static asInt(num: string | number): number {
    return parseInt(num as unknown as string) || 0;
  }

  static mul(...a: number[]): number {
    let b = 1;
    for (const x of a) {
      b *= parseFloat(x as unknown as string);
    }
    return b;
  }

  static add(...a: number[]): number {
    let b = 0;
    for (const x of a) b += x || 0;
    return b;
  }

  static ceil(a: number): number {
    return Math.ceil(a);
  }
}
