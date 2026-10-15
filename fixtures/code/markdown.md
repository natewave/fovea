# Fovea

An evidence-based color scheme for **VS Code**, **Ghostty** and the web.

> Sharp center, calm periphery.

## Install

1. Open the Extensions view.
2. Search for `Fovea` and choose **Install**.
3. Pick *Fovea Day*, *Fovea Dusk* or *Fovea Night* from **Preferences: Color Theme**.

To follow your system's light or dark setting, add this to `settings.json`:

```json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "Fovea Day",
  "workbench.preferredDarkColorTheme": "Fovea Dusk"
}
```

## Why these colors

- Lightness carries legibility; hue is a secondary cue.
- Red is reserved for errors and deletions.
- Every pair that carries meaning is checked under color-vision deficiency simulation.

| Variant | Polarity | Suited to |
|---|---|---|
| Day | light | long reading, bright rooms |
| Dusk | dark | dim rooms, dark-mode preference |
| Night | dark | dark rooms, late hours |

Read the [research notes](docs/research.md) or the [design document](docs/design.md).

---

Released under the MIT License.
