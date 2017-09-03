export default class AirtableError {
  constructor(error, message, statusCode) {
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }
  toString() {
    return [
      this.message,
      "(",
      this.error,
      ")",
      this.statusCode ? "[Http code " + this.statusCode + "]" : ""
    ].join("");
  }
}
