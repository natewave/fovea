export interface Output {
  /** Path relative to the repository root. */
  readonly path: string;
  /** Text is written as UTF-8; bytes are written as they are. */
  readonly contents: string | Uint8Array;
}

export interface TextOutput extends Output {
  readonly contents: string;
}

export const outputBytes = (o: Output): Uint8Array =>
  typeof o.contents === "string" ? new TextEncoder().encode(o.contents) : o.contents;

export const isTextOutput = (o: Output): o is TextOutput => typeof o.contents === "string";
