# Since — Style Guide

The single source of truth for the UI. Components consume the design tokens and role classes
in `src/theme/variables.css` — **never hardcoded hex or px**.

## Principles

- **Dark-locked.** The app forces the dark palette (`dark.always`); there is no light mode.
- **One fixed accent, many card colors.** The chrome uses a single amber accent
  (`--since-accent`). The _colorful_ element is each counter's own `hexColor`, applied as the
  card surface — that's what makes the home grid feel personal.
- **Editorial serif for the numbers, sans for chrome.** The elapsed figure ("4 weeks") and
  headings are Newsreader (serif); labels, buttons, and metadata are Inter (sans).

## Tokens (excerpt — see `variables.css` for the full set)

| Token                                                                  | Use                                 |
| ---------------------------------------------------------------------- | ----------------------------------- |
| `--since-bg`                                                           | App canvas (near-black)             |
| `--since-surface` / `--since-surface-2`                                | Cards, inputs                       |
| `--since-text` / `--since-text-secondary` / `--since-text-tertiary`    | Text ramp                           |
| `--since-on-card` / `--since-on-card-secondary`                        | Text on a counter's colored surface |
| `--since-accent` / `--since-accent-pressed` / `--since-on-accent`      | The one brand hue                   |
| `--since-danger` / `--since-success` / `--since-warning`               | Status                              |
| `--since-space-1..8`                                                   | 4px spacing grid                    |
| `--since-radius-card` / `--since-radius-thumb` / `--since-radius-pill` | Radii                               |
| `--since-safe-top`                                                     | iOS notch inset                     |

## Type roles

| Class                                           | Role                                                    |
| ----------------------------------------------- | ------------------------------------------------------- |
| `.since-h1` / `.since-hero` / `.since-headline` | Headings (serif)                                        |
| `.since-elapsed`                                | The big "4 weeks" figure on a counter card / stat cells |
| `.since-dek`                                    | Supporting prose (sans)                                 |
| `.since-label`                                  | Form/field labels                                       |
| `.since-kicker`                                 | Uppercase accent label                                  |
| `.since-meta`                                   | Small metadata (sans, tertiary)                         |

## Components

- **Counter card** — colored surface (`hexColor`), emoji + title at top, the elapsed figure
  large, a `since <title>` line, and a pill **reset** button pinned to the bottom. Tapping the
  card opens its history; the reset button stops propagation.
- **Create form** — emoji, name, a color swatch row, and an optional "remind me after N days".
- **History screen** — a 4-cell stat strip (Current / Resets / Longest / Average) over a list
  of past intervals, newest first.
- **Buttons** — pills; primary uses the accent, on-card actions use a translucent dark fill.
