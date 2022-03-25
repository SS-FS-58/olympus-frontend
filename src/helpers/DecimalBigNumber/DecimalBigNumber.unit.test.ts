import { BigNumber } from "@ethersproject/bignumber";

import { DecimalBigNumber } from "./DecimalBigNumber";

describe("DecimalBigNumber", () => {
  it("should initialise with BigNumber", () => {
    expect(new DecimalBigNumber(BigNumber.from("101"), 1).toString()).toEqual("10.1");
    expect(() => {
      new DecimalBigNumber(BigNumber.from("101"));
    }).toThrow(); // decimals is required
  });

  it("should determine decimal places at initialisation", () => {
    expect(new DecimalBigNumber("100").toString()).toEqual("100");
    expect(new DecimalBigNumber("1").toString()).toEqual("1");
    expect(new DecimalBigNumber("1", 0).toString()).toEqual("1");
    expect(new DecimalBigNumber("1.1", 0).toString()).toEqual("1");
    expect(new DecimalBigNumber("1.1").toString()).toEqual("1.1");
    expect(new DecimalBigNumber("1.222333").toString()).toEqual("1.222333");
  });

  it("should handle unexpected inputs when initialized", () => {
    expect(new DecimalBigNumber("", 9).toString()).toEqual("0.0");
    expect(new DecimalBigNumber("      ", 9).toString()).toEqual("0.0");
    expect(new DecimalBigNumber("text", 1).toString()).toEqual("0.0");
    expect(new DecimalBigNumber(".0", 1).toString()).toEqual("0.0");
    expect(new DecimalBigNumber(".", 1).toString()).toEqual("0.0");
    expect(new DecimalBigNumber("....", 1).toString()).toEqual("0.0");
    expect(new DecimalBigNumber("1.1.1.1.1", 1).toString()).toEqual("0.0");
    expect(new DecimalBigNumber("-", 1).toString()).toEqual("0.0");
    expect(new DecimalBigNumber("-0.", 1).toString()).toEqual("0.0");
  });

  it("should discard irrelevant precision when initialized", () => {
    expect(new DecimalBigNumber("1.12345678913139872398723", 9).toString()).toEqual("1.123456789");
  });

  it("should handle number inputs", () => {
    expect(new DecimalBigNumber((1).toString(), 9).toString()).toEqual("1.0");
    expect(new DecimalBigNumber((1.2).toString(), 9).toString()).toEqual("1.2");
    expect(new DecimalBigNumber((-1.2).toString(), 9).toString()).toEqual("-1.2");
    expect(new DecimalBigNumber((1.12345678913).toString(), 9).toString()).toEqual("1.123456789");
  });

  it("should reject invalid decimals parameter", () => {
    expect(() => {
      new DecimalBigNumber(".1", 1).toString({ decimals: -1 });
    }).toThrow(); // decimals should be 0 or positive
  });

  it("should accurately format number to an accurate string", () => {
    expect(new DecimalBigNumber(".1", 1).toString()).toEqual("0.1");
    expect(new DecimalBigNumber("1.1", 0).toString()).toEqual("1");
    expect(new DecimalBigNumber(".1", 1).toString({ decimals: 0 })).toEqual("0");
    expect(new DecimalBigNumber(".1", 1).toString({ decimals: 1 })).toEqual("0.1");
    expect(new DecimalBigNumber("1.123").toString({ decimals: 2 })).toEqual("1.12");
  });

  it("should accurately format number to an accurate string and strip trailing zeroes", () => {
    expect(new DecimalBigNumber("1.1", 9).toString()).toEqual("1.1");
    expect(new DecimalBigNumber("1.123", 9).toString()).toEqual("1.123");
    expect(new DecimalBigNumber("-1.123", 9).toString()).toEqual("-1.123");
  });

  it("should accurately format string output", () => {
    expect(new DecimalBigNumber("1000", 2).toString({ format: true })).toEqual("1,000");
    expect(new DecimalBigNumber("-1000", 2).toString({ format: true })).toEqual("-1,000");
    expect(new DecimalBigNumber("1000.1", 2).toString({ format: true })).toEqual("1,000.1");
    expect(new DecimalBigNumber("-1000.1", 2).toString({ format: true })).toEqual("-1,000.1");
    expect(new DecimalBigNumber("1000.1", 2).toString({ decimals: 0, format: true })).toEqual("1,000");
    expect(new DecimalBigNumber("-1000.1", 2).toString({ decimals: 0, format: true })).toEqual("-1,000");
    expect(new DecimalBigNumber("1000.1", 2).toString({ decimals: 4 })).toEqual("1000.1");
    expect(new DecimalBigNumber("-1000.1", 2).toString({ decimals: 4 })).toEqual("-1000.1");
    expect(new DecimalBigNumber("1000.1", 2).toString({ decimals: 4, trim: false })).toEqual("1000.1000");
    expect(new DecimalBigNumber("-1000.1", 2).toString({ decimals: 4, trim: false })).toEqual("-1000.1000");
  });

  it("should add another number correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).add(new DecimalBigNumber("1.2", 18)).toString()).toEqual("2.3");
    expect(new DecimalBigNumber("-1.1", 9).add(new DecimalBigNumber("-1.2", 18)).toString()).toEqual("-2.3");
  });

  it("should subtract another number correctly", () => {
    expect(new DecimalBigNumber("1.2", 9).sub(new DecimalBigNumber("1.1", 18)).toString()).toEqual("0.1");
    expect(new DecimalBigNumber("1.1", 9).sub(new DecimalBigNumber("1.2", 18)).toString()).toEqual("-0.1");
  });

  it("should compare the magnitude against another number and determine the greater number correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).gt(new DecimalBigNumber("1.2", 18))).toEqual(false);
    expect(new DecimalBigNumber("1.21", 9).gt(new DecimalBigNumber("1.2", 18))).toEqual(true);
  });

  it("should compare the magnitude against another number and determine the lesser number correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).lt(new DecimalBigNumber("1.2", 18))).toEqual(true);
    expect(new DecimalBigNumber("1.21", 9).lt(new DecimalBigNumber("1.2", 18))).toEqual(false);
  });

  it("should determine if two numbers are equal", () => {
    expect(new DecimalBigNumber("1.1", 9).eq(new DecimalBigNumber("1.1", 9))).toEqual(true);
    expect(new DecimalBigNumber("1.1", 9).eq(new DecimalBigNumber("1.1", 18))).toEqual(true);
    expect(new DecimalBigNumber("1.111111111", 9).eq(new DecimalBigNumber("1.111111111000000000", 18))).toEqual(true);
    expect(new DecimalBigNumber("1.111111111", 9).eq(new DecimalBigNumber("1.111111111111111111", 18))).toEqual(false);
    expect(new DecimalBigNumber("1.111111111", 9).eq(new DecimalBigNumber("1.111111111222222222", 18))).toEqual(false);
    expect(new DecimalBigNumber("1.1", 9).eq(new DecimalBigNumber("1.2", 9))).toEqual(false);
    expect(new DecimalBigNumber("1.1", 9).eq(new DecimalBigNumber("0", 9))).toEqual(false);
    expect(new DecimalBigNumber("0", 9).eq(new DecimalBigNumber("0", 9))).toEqual(true);
  });

  it("should multiply by a number correctly", () => {
    // gOHM to OHM
    const gohm = new DecimalBigNumber("2", 18); // 180 OHM
    const index = new DecimalBigNumber("90", 9); // Index of 90
    expect(gohm.mul(index, 9).toString()).toEqual("180.0");
    expect(index.mul(gohm, 9).toString()).toEqual("180.0");

    const decimalNumber = new DecimalBigNumber("20.12", 9);
    const secondDecimalNumber = new DecimalBigNumber("1.12", 9);
    expect(decimalNumber.mul(secondDecimalNumber, 9).toString()).toEqual("22.5344");
  });

  it("should divide by a number correctly", () => {
    // OHM to gOHM
    const ohm = new DecimalBigNumber("180", 9); // 2 gOHM
    const index = new DecimalBigNumber("90", 9); // Index of 90
    expect(ohm.div(index, 18).toString()).toEqual("2.0");
    expect(index.div(ohm, 18).toString()).toEqual("0.5");
  });
});
