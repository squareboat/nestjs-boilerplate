import * as bcrypt from 'bcryptjs';

export class Hash {
  static saltRounds = 10;

  static async make(str: string): Promise<string> {
    return bcrypt.hash(str, Hash.saltRounds);
  }

  static async compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
