import cases from "jest-in-case";
import check, { isArrayOf } from "./typecheck";

const trueFn = () => true;
const falseFn = () => false;

describe("typecheck", () => {
  describe("check", () => {
    test("truthy response", () => {
      const { pass, error } = check(trueFn, "my-error")();
      expect(pass).toBe(true);
      expect(error).toBeUndefined();
    });
    test("falsey response", () => {
      const { pass, error } = check(falseFn, "my-error")();
      expect(pass).toBe(false);
      expect(error).toBe("my-error");
    });
  });

  describe("isOneOf", () => {});
  describe("isArrayOf", () => {
    test("[String]", () => {
      const { pass, error } = check(
        isArrayOf(str => typeof str == "string"),
        "the value for `fields` should be an array of strings"
      )(["passing string"]);
      expect(pass).toBe(true);
      expect(error).toBeUndefined();
    });
  });
});
