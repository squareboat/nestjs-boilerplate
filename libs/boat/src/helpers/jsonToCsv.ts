import { AsyncParser } from "@json2csv/node"
import { Parser } from "@json2csv/plainjs";

export class Json2Csv {
  static handle(data: Record<string, any>, options: { delimiter: string }) {
    const delimiter = options.delimiter || ',';
    let header = '';
    for (const key in data[0]) {
      let keys = key.split('.');
      header = header + keys[keys.length - 1] + delimiter;
    }
    header = header + '\n';
    data.forEach((curr) => {
      for (const key in curr) {
        const value = curr[key] && String(curr[key]).replace(delimiter, ';');
        header = header + (value ?? 'NA') + delimiter;
      }
      header = header + '\n';
    });
    return header;
  }

  static async parseAsync(
    data: Record<string, any>,
    opts: Record<string, any>,
  ): Promise<string> {
    const parser = new AsyncParser(opts);
    return parser.parse(data).promise();
  }

  static parse(
    data: Record<string, any>,
    opts: Record<string, any>,
  ): string {
    const parser = new Parser(opts);
    return parser.parse(data);
  }
}
