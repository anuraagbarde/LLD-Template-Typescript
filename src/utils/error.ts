export class BadRequestError extends Error {
  httpCode: 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadrequestError';
    this.httpCode = 400;
  }
}
