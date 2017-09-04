import cases from "jest-in-case";
import Record from "./record";

const data = [{ table: {}, recordId: 5, recordJson: {} }];

describe("record", () => {
  cases(
    "new Record(table, recordId, recordJson)",
    ({ table, recordId, recordJson }) => {
      expect(new Record(table, recordId, recordJson)).toMatchSnapshot();
    },
    data
  );
});
