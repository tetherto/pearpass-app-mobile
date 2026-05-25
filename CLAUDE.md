# pearpass-app-mobile-tether

## UI: always use `@tetherto/pearpass-lib-ui-kit`

UI is built on `@tetherto/pearpass-lib-ui-kit`. All new UI and edits to existing screens **must** use components from this kit. Do not roll custom buttons, inputs, modals, typography, or icons.

**Full guide:** the component catalog, props, theming conventions (React Native `StyleSheet` + `rawTokens`), and reference files live in [AGENTS.md](AGENTS.md) (canonical contributor doc, also loaded by Codex/Cursor). Claude Code's skill trigger loads the same content via [.claude/skills/use-ui-kit/SKILL.md](.claude/skills/use-ui-kit/SKILL.md) whenever you're editing `.tsx`/`.jsx` files.

**Hard rules:**
- If a component exists in the kit, use it. If it does not, raise it with the team before creating a local alternative.
- Do **not** add new files under [src/libComponents/](src/libComponents/) — that tree is legacy and should not grow. Migrate callers to the kit equivalents when you touch them.
- Style with `useTheme()` + `rawTokens` from the kit. No hardcoded hex colors or design-system spacing. React Native takes numbers, not `${n}px` strings.
- Import icons from `@tetherto/pearpass-lib-ui-kit/icons` (530 available). Do not add new SVGs under `src/`.
