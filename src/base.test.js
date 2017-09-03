import Base from "./base";

describe("base", () => {
  test("new Base", () => {
    const base = new Base("my-table", "my-id");

    expect(base._airtable).toBe("my-table");
    expect(base._id).toBe("my-id");
  });
});
