export class UnauthorizedError extends Error {
  constructor(message: string = 'UNAUTHORIZED') {
    super(message);
  }
}