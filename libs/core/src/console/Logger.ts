import * as chalk from 'chalk';
// import { Table } from 'console-table-printer';
import Table = require('cli-table3');

export class Logger {
  /**
   * Use this method to print an information line
   * @param msg
   * @returns void
   */
  public static info(msg: string, color?: string): void {
    color = color || 'cyan';
    console.log(chalk[color](msg));
  }

  /**
   * Use this method to print an error message
   * @param msg
   * @returns void
   */
  static error(msg: string): void {
    console.log(chalk.bgRed.bold(msg));
  }

  /**
   * Use this method to print a line.
   * Prints line half the width of the console
   * @returns void
   */
  static line(): void {
    console.log(chalk.bgGray('-'.repeat(process.stdout.columns / 2)));
  }

  /**
   * Use this method to print a success message
   * @param msg
   * @returns void
   */
  static success(msg: string) {
    this.print(msg, 'green');
  }

  /**
   * Use this function to print table in console
   * @param rows
   * @param options
   * @returns void
   */
  static table(rows: Record<string, any>[]): void {
    let columns = [];
    for (const row of rows) {
      columns = columns.concat(Object.keys(row));
    }
    columns = [...new Set(columns)];
    const uniqueCols = [];
    for (const col of columns) {
      uniqueCols.push(
        chalk.cyan.bold(col.charAt(0).toUpperCase() + col.slice(1)),
      );
    }

    const pRows = [];
    rows.forEach(r => pRows.push(Object.values(r)));

    const p = new Table({ head: uniqueCols });
    p.push(...pRows);

    console.log(p.toString());
  }

  static print(msg: string, color) {
    console.log(chalk[color](msg));
  }
}
