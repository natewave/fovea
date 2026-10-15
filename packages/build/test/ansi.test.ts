import { describe, expect, it } from "vitest";
import { PLAIN_STYLE, parseAnsi } from "../src/index.ts";

const ESC = "\u001b";

describe("parseAnsi", () => {
  it("keeps unstyled text as plain spans", () => {
    expect(parseAnsi("hello\n")).toEqual([[{ text: "hello", style: PLAIN_STYLE }]]);
  });

  it("maps normal, bright and background colors to palette indices", () => {
    const [line] = parseAnsi(`${ESC}[31mred${ESC}[92mgreen${ESC}[44mon blue${ESC}[0m`);
    expect(line?.map((s) => [s.text, s.style.fg, s.style.bg])).toEqual([
      ["red", 1, null],
      ["green", 10, null],
      ["on blue", 10, 4],
    ]);
  });

  it("applies attributes and their resets", () => {
    const [line] = parseAnsi(`${ESC}[1;2mdim bold${ESC}[22mplain${ESC}[7;3mx${ESC}[27;23my`);
    expect(line?.map((s) => [s.text, s.style.bold, s.style.faint])).toEqual([
      ["dim bold", true, true],
      ["plain", false, false],
      ["x", false, false],
      ["y", false, false],
    ]);
    expect(line?.[2]?.style).toMatchObject({ inverse: true, italic: true });
    expect(line?.[3]?.style).toMatchObject({ inverse: false, italic: false });
  });

  it("treats an empty parameter list as a reset", () => {
    const [line] = parseAnsi(`${ESC}[31ma${ESC}[mb`);
    expect(line?.[1]).toEqual({ text: "b", style: PLAIN_STYLE });
  });

  it("skips 256-color and truecolor parameters without misreading their arguments", () => {
    const [line] = parseAnsi(`${ESC}[38;5;196;1ma${ESC}[48;2;1;2;3;32mb`);
    expect(line?.[0]?.style).toMatchObject({ fg: null, bold: true });
    expect(line?.[1]?.style).toMatchObject({ fg: 2, bg: null, bold: true });
  });

  it("carries the style across line breaks and keeps empty lines", () => {
    const lines = parseAnsi(`${ESC}[32mone\n\ntwo${ESC}[0m\n`);
    expect(lines).toHaveLength(3);
    expect(lines[1]).toEqual([]);
    expect(lines[2]?.[0]).toMatchObject({ text: "two", style: { fg: 2 } });
  });
});
