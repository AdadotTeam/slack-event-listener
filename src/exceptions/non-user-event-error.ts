export class NonUserEventError extends Error {
  constructor() {
    super();
    this.name = "NonUserEventError";
  }
}
