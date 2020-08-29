export class DbRepositoryException extends Error {
  constructor(public message: string) {
    super(message);
  }
}
