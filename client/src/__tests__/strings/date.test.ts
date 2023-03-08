import getDate from "../../utils/strings/date";

const UTC = "2021-01-01T00:00:00.000Z";

describe("getDate", () => {
  test("default format", () => {
    expect(getDate(UTC)).toBe("01/01/2021 01:00 AM");
  });

  test("on calendar format", () => {
    expect(getDate(UTC, { format: "on calendar" })).toBe("on January 1, 2021");
  });

  test("short calendar format", () => {
    expect(getDate(UTC, { format: "short calendar" })).toBe("on Jan 1, 2021");
  });

  test("L format", () => {
    expect(getDate(UTC, { format: "L" })).toBe("01/01/2021");
  });

  test("short month year format", () => {
    expect(getDate(UTC, { format: "short month year" })).toBe("Jan 1, 2021");
  });
});