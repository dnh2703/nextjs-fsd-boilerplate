import { describe, expect, it } from "vitest";

import { getServerEnv } from "./env";

describe("getServerEnv", () => {
  it("returns the parsed env when DATABASE_URL is a postgres URL", () => {
    const env = getServerEnv({ DATABASE_URL: "postgres://u:p@localhost:5432/app" });
    expect(env.DATABASE_URL).toBe("postgres://u:p@localhost:5432/app");
  });

  it("accepts the postgresql:// scheme", () => {
    expect(getServerEnv({ DATABASE_URL: "postgresql://localhost/app" }).DATABASE_URL).toBe(
      "postgresql://localhost/app",
    );
  });

  it("throws a helpful error when DATABASE_URL is missing", () => {
    expect(() => getServerEnv({})).toThrow(/DATABASE_URL is required.*\.env\.example/);
  });

  it("throws when DATABASE_URL is not a postgres URL", () => {
    expect(() => getServerEnv({ DATABASE_URL: "mysql://localhost/app" })).toThrow(
      /DATABASE_URL must be a postgres:\/\/ connection string/,
    );
  });
});
