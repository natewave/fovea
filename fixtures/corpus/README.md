# Real-code corpus

Unmodified source files from open-source projects, used only to count how often each syntax class appears ([`docs/generated/token-frequency.md`](../../docs/generated/token-frequency.md)). Each file sits next to its project's licence, and each is pinned to a release tag so the count is reproducible.

| File | Project | Tag | Licence |
|---|---|---|---|
| [`vscode/arrays.ts`](vscode/arrays.ts) | [microsoft/vscode](https://github.com/microsoft/vscode/blob/1.90.0/src/vs/base/common/arrays.ts) | `1.90.0` | MIT |
| [`requests/sessions.py`](requests/sessions.py) | [psf/requests](https://github.com/psf/requests/blob/v2.32.3/src/requests/sessions.py) | `v2.32.3` | Apache-2.0 (with NOTICE) |
| [`go/scan.go`](go/scan.go) | [golang/go](https://github.com/golang/go/blob/go1.23.0/src/bufio/scan.go) | `go1.23.0` | BSD-3-Clause |
| [`bat/printer.rs`](bat/printer.rs) | [sharkdp/bat](https://github.com/sharkdp/bat/blob/v0.24.0/src/printer.rs) | `v0.24.0` | MIT (dual-licensed MIT or Apache-2.0; used under MIT) |
| [`guava/Strings.java`](guava/Strings.java) | [google/guava](https://github.com/google/guava/blob/v33.2.1/guava/src/com/google/common/base/Strings.java) | `v33.2.1` | Apache-2.0 |
| [`scala/Option.scala`](scala/Option.scala) | [scala/scala](https://github.com/scala/scala/blob/v2.13.14/src/library/scala/Option.scala) | `v2.13.14` | Apache-2.0 (with NOTICE) |
| [`curl/base64.c`](curl/base64.c) | [curl/curl](https://github.com/curl/curl/blob/curl-8_8_0/lib/base64.c) | `curl-8_8_0` | curl licence (MIT-style) |
| [`nvm/install.sh`](nvm/install.sh) | [nvm-sh/nvm](https://github.com/nvm-sh/nvm/blob/v0.39.7/install.sh) | `v0.39.7` | MIT |

Files that are mostly embedded data are left out, since a single long data string would dominate the character counts. That is why VS Code is represented by `arrays.ts` rather than `strings.ts`, whose Unicode tables make up more than half of its characters.

These files are not part of Fovea and are not covered by Fovea's MIT licence. Fovea's own samples, written for the project, are in [`../code/`](../code/).
