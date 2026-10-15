# Terminal samples

Transcripts of common terminal output, used to preview the ANSI colors on the palette report and the website. They were written for Fovea and follow the default colors of each tool (git, a Vitest-style test runner, GNU `ls`, rustc and a zsh-style prompt); they are not captured from a real session.

`\e` stands for the escape character (U+001B), so the files stay readable and diffable. To see one in a terminal:

```sh
printf '%b' "$(cat fixtures/terminal/git-status.txt)"
```

Only the 16 standard colors and the bold, faint, italic, underline and inverse attributes are used.
