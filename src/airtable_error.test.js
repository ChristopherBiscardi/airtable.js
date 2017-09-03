import cases from "jest-in-case";
import AirtableError from "./airtable_error";

const data = [
  { err: "my-error", msg: "some message", code: 500 },
  { err: "my-error", msg: "some message", code: undefined }
];

describe("airtable_error", () => {
  cases(
    "new AirtableError(error, message, statusCode)",
    ({ err, msg, code }) => {
      expect(new AirtableError(err, msg, code)).toMatchSnapshot();
    },
    data
  );
  cases(
    "new AirtableError(error, message, statusCode)",
    ({ err, msg, code }) => {
      expect(new AirtableError(err, msg, code).toString()).toMatchSnapshot();
    },
    data
  );
});
