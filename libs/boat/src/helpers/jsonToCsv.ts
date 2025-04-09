import { parseAsync, parse } from 'json2csv';

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
    return parseAsync(data, opts);
  }

  static async parse(
    data: Record<string, any>,
    opts: Record<string, any>,
  ): Promise<string> {
    return parse(data, opts);
  }
}
