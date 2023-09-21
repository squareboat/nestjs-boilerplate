export class ExpParser {
  private parsedExp: Array<any>;
  constructor(private exp: string) {
    this.parsedExp = [];
  }

  static from(exp: string): ExpParser {
    const parser = new ExpParser(exp);
    parser.handle();
    return parser;
  }

  private handle(): this {
    let o = {};
    let p = [];
    const presenter = [];

    const length = this.exp.length;
    let i = 0;
    let b = 0;
    while (i < length) {
      const ch = this.exp.charCodeAt(i);
      if (ch == 91) b++;
      if (ch == 93) b--;
      if (b == -1) return this;
      if (ch == 91 && b == 1) {
        o['name'] = p.join('');
        p = [];
      } else if (ch == 93 && b == 0) {
        o['args'] = [p.join('')];
        presenter.push(o);
        p = [];
        o = {};
      } else if (ch == 44 && b == 0) {
        if (p.join('') != '') {
          o['name'] = p.join('');
          presenter.push(o);
          p = [];
          o = {};
        }
      } else p.push(String.fromCharCode(ch));
      i++;
    }
    if (this.exp.charCodeAt(i - 1) != 93) presenter.push({ name: p.join('') });
    this.parsedExp = presenter;

    return this;
  }

  toObj(): Record<string, any> {
    const obj = {};
    for (const o of this.parsedExp) {
      obj[o.name] = o.args;
    }

    return obj;
  }

  toArr(): Array<Record<string, any>> {
    return this.parsedExp;
  }
}
