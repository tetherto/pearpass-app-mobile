# pearpass-app-mobile-tether

## UI: always use `@tetherto/pearpass-lib-ui-kit`

UI is built on `@tetherto/pearpass-lib-ui-kit`. All new UI — v2 redesigns of existing screens and net-new features — **must** use components from this kit. Do not roll custom buttons, inputs, modals, typography, or icons.

**Full guide:** the component catalog, props, theming conventions (React Native `StyleSheet` + `rawTokens`), and reference files live in [AGENTS.md](AGENTS.md) (canonical contributor doc, also loaded by Codex/Cursor). Claude Code's skill trigger loads the same content via [.claude/skills/use-ui-kit/SKILL.md](.claude/skills/use-ui-kit/SKILL.md) whenever you're editing `.tsx`/`.jsx` files.

**Hard rules:**
- If a component exists in the kit, use it. If it does not, raise it with the team before creating a local alternative.
- Do **not** add new files under [src/libComponents/](src/libComponents/) — that tree is legacy (v1) and should not grow. Also do not import from `@tetherto/pearpass-lib-ui-react-native-components` in new v2 files — it's the second legacy source being phased out.
- Style with `useTheme()` + `rawTokens` from the kit. No hardcoded hex colors or design-system spacing. React Native takes numbers, not `${n}px` strings.
- Import icons from `@tetherto/pearpass-lib-ui-kit/icons` (530 available). Do not add new SVGs under `src/`.

**When the kit applies:** the active design is controlled by the `MOBILE_DESIGN_VERSION` flag from `@tetherto/pearpass-lib-constants`. Currently `MOBILE_DESIGN_VERSION === 1` — v1 is still active at runtime and the flag flip to `2` is pending. Build all new UI with kit components so the code is ready when the flag flips.

**`V2` suffix is for coexistence only.** If a v1 file already exists for the component you're creating, add the `V2` suffix (e.g. `ModifyVaultModalContentV2` alongside legacy `ModifyVaultModalContent`). If the component is net-new with no v1 sibling, use its natural name — **no suffix**. A handful of screens use a `v2/` subdirectory pattern instead (e.g. `src/screens/CreateRecord/v2/`) — match the neighbourhood you're editing in.
