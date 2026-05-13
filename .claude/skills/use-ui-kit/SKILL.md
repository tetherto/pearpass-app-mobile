---
name: use-ui-kit
description: Use whenever creating or editing UI in this repo — React Native components, modals, bottom sheets, forms, buttons, inputs, typography, styling, icons, or any .tsx/.jsx work. The repo uses `@tetherto/pearpass-lib-ui-kit` as the single source for UI primitives; do not roll custom ones. Load this before suggesting any UI change, especially for v2 files (V2 suffix / `v2/` subdirectories) or when touching src/components, src/containers, src/screens.
---

<!-- Mirror of AGENTS.md at repo root — keep in sync. AGENTS.md is the canonical copy; this file exists so Claude Code's skill-trigger mechanism can lazy-load the same content on UI work. -->

# UI conventions for pearpass-app-mobile-tether

This is the React Native + Expo mobile app for PearPass, written in JavaScript + TypeScript. UI is built on the shared component library `@tetherto/pearpass-lib-ui-kit`.

This document is for **anyone contributing UI** to the repo — new hires, current engineers, and AI coding assistants (Claude Code, Cursor, Codex, etc.). It captures the component catalog, styling conventions, file-naming rules, and patterns we use when building UI in this app. Read it once before your first UI change; keep it open when you're in doubt.

## Design-system state — `MOBILE_DESIGN_VERSION`

Which design renders at runtime is controlled by the `MOBILE_DESIGN_VERSION` flag from `@tetherto/pearpass-lib-constants`, consumed via `isV2()` in [src/utils/designVersion.js](../../../src/utils/designVersion.js).

**Currently `MOBILE_DESIGN_VERSION === 1`** — v1 is still the active design at runtime, and the flag flip to `2` is pending. All new UI work should be built against the kit so it's ready when the flag flips. Legacy v1 components live in two places — [src/libComponents/](../../../src/libComponents/) and the package `@tetherto/pearpass-lib-ui-react-native-components` — and render whenever `isV2()` returns `false`. Do not delete them as part of v2 work.

## File naming: when to use the `V2` suffix

The `V2` suffix is a **coexistence marker**, not a design marker. Use it only when a v1 sibling already exists:

- **A v1 file already exists** → create a new file with the `V2` suffix next to it (e.g. v1 `ModifyVaultModalContent.jsx` → new `ModifyVaultModalContentV2.jsx`). Both live in the tree during migration; the branching happens at the call site via `isV2()`. See [src/containers/Modal/ModifyVaultModalContentV2/](../../../src/containers/Modal/ModifyVaultModalContentV2/) for a real example.
- **No v1 equivalent exists** (net-new feature, net-new component) → create the file with its natural name, **no `V2` suffix**.

A handful of screens use a `v2/` subdirectory pattern instead of a suffix (e.g. [src/screens/CreateRecord/v2/](../../../src/screens/CreateRecord/v2/)). Either is acceptable — match the neighbourhood you're editing in.

Before creating a file, glob the directory for the base name without the suffix. If nothing comes up, skip the suffix.

## Golden rules

1. **Check the catalog below before creating any component.** If it exists in the kit, use it — never wrap or reimplement.
2. **All new UI goes through `@tetherto/pearpass-lib-ui-kit`.** New `.tsx`/`.jsx` files must import from the kit, **not** from [src/libComponents/](../../../src/libComponents/) and **not** from `@tetherto/pearpass-lib-ui-react-native-components`. Both of those are legacy sources for v2 work.
3. **Never add variants under [src/libComponents/](../../../src/libComponents/)** (`ButtonThin`, `ButtonPrimary`, `ButtonLittle`, `InputPasswordPearPass`, etc.). That tree is legacy; the kit's `Button` takes variants.
4. **Style with tokens.** `useTheme()` + `rawTokens`. No hardcoded hex colors or design-system spacing.
5. **Icons come from the kit.** `@tetherto/pearpass-lib-ui-kit/icons` has 530 icons. Do not add new SVGs under `src/`.
6. **If the kit lacks something you need, stop and ask.** Don't silently roll a custom component.

## Component catalog (33 components)

Import pattern: `import { ComponentName } from '@tetherto/pearpass-lib-ui-kit'`

### Actions
- `Button` — all CTAs. Takes variants; use instead of `ButtonThin`, `ButtonPrimary`, `ButtonSecondary`, `ButtonFilter`, `ButtonLittle`, `ButtonCreate`, `ButtonUniversal`.
- `Pressable` — low-level pressable wrapper for custom interactive elements.
- `Link` — text links.

### Forms
- `Form` — form wrapper; pair with `useForm` from `@tetherto/pear-apps-lib-ui-react-hooks`.
- `InputField` — text input. Use instead of the legacy `InputField` / `PearPassInputField`.
- `PasswordField` — password input with strength indicator. Use instead of legacy `PasswordField` / `InputPasswordPearPass`.
- `SearchField`, `SelectField`, `Dropdown`, `TextArea`
- `Checkbox`, `Radio`, `ToggleSwitch`, `Slider`
- `DateField`, `AttachmentField`, `UploadField`
- `MultiSlotInput` — split inputs for OTP / recovery codes.
- `FieldError` — inline field validation error.

### Typography
- `Title` — headings.
- `Text` — body text.

### Layout / surfaces
- `Dialog` — modals.
- `NativeBottomSheet` — bottom sheets.
- `PageHeader`, `ItemScreenHeader`, `Breadcrumb`, `ListItem`, `NavbarListItem`, `ContextMenu`.

### Feedback
- `AlertMessage`, `Snackbar`, `PasswordIndicator`, `RingSpinner`.

### Type exports
- `ThemeColors`, `Theme`, `ThemeType`, `RawTokens`
- `PasswordIndicatorVariant` — `'vulnerable' | 'decent' | 'strong'`
- `ButtonVariant` — `'primary' | 'secondary' | 'tertiary' | 'destructive'`
- `ButtonSize` — `'small' | 'medium'`

Import types with `import type { ... } from '@tetherto/pearpass-lib-ui-kit'`.

For components not listed, open `node_modules/@tetherto/pearpass-lib-ui-kit/dist/components/<Name>/types.d.ts`.

## Component props (15 most-used)

Required props have no `?`. **Always include a `testID` on interactive components** (buttons, fields, toggles, dialogs).

- **Button** — `variant: 'primary' | 'secondary' | 'tertiary' | 'destructive'`, `size?: 'small' | 'medium'`, `onClick`, `children`, `type?: 'button' | 'submit'`, `disabled?`, `isLoading?`, `fullWidth?`, `iconBefore?`, `iconAfter?`, `testID?`. Icon-only buttons need `aria-label`.
- **Dialog** — `title` (ReactNode), `onClose?`, `open?`, `footer?`, `children?`, `closeOnOutsideClick?`, `hideCloseButton?`, `trapFocus?`, `initialFocusRef?`, `testID?`, `closeButtonTestID?`. Put action buttons in `footer`.
- **InputField** — `label`, `value`, `onChangeText?: (v: string) => void`, `placeholder?`, `error?: string`, `inputType?: 'text' | 'password'`, `disabled?`, `readOnly?`, `copyable?`, `onCopy?`, `leftSlot?`, `rightSlot?`, `testID?`.
- **PasswordField** — `label`, `value`, `onChangeText?`, `placeholder?`, `error?`, `passwordIndicator?: 'vulnerable' | 'decent' | 'strong' | 'match'`, `infoBox?: string`, `copyable?`, `testID?`.
- **SearchField** — `value`, `onChangeText`, `placeholderText?`, `size?: 'small' | 'medium'`, `testID?`.
- **Form** — `children`, `onSubmit?`, `noValidate?`, `testID?`.
- **Text** — `children`, `variant?: 'label' | 'labelEmphasized' | 'body' | 'bodyEmphasized' | 'caption'`, `color?`, `numberOfLines?`.
- **Title** — `children`, `as?: 'h1' | 'h2' | ... | 'h6'`.
- **AlertMessage** — `variant: 'info' | 'warning' | 'error'`, `size: 'small' | 'medium' | 'big'`, `title`, `description` (ReactNode), `actionText?`, `onAction?`, `backgroundColor?`, `color?`, `testID?`, `actionTestId?`.
- **ToggleSwitch**, **Checkbox** — `checked?`, `onChange?: (b: boolean) => void`, `label?`, `description?`, `disabled?`, `testID?`.
- **Radio** — `options: Array<{value, label?, description?, disabled?}>`, `value?`, `onChange?: (v: string) => void`, `testID?`.
- **SelectField** — `label`, `value?`, `placeholder?`, `onClick?` (opens dropdown), `error?`, `disabled?`, `leftSlot?`, `rightSlot?`, `testID?`.
- **TextArea** — `value`, `onChange?`, `label?`, `placeholder?`, `error?`, `disabled?`, `testID?`.
- **Link** — `children`, `href?`, `isExternal?`, `onClick?`, `testID?`.

### Prop naming — mobile uses `onChangeText`, not `onChange`

The kit's TypeScript defs mark `onChangeText` / `placeholderText` / `errorMessage` as `@deprecated` in favour of `onChange` / `placeholder` / `error`. **That's a web-centric note.** The `onChange` signature the kit declares is `(e: React.ChangeEvent<HTMLInputElement>) => void`, which React Native does not produce.

**For this mobile repo:** keep using `onChangeText` (receives a `string`) on `InputField`, `PasswordField`, `SearchField`, and `TextArea`. That's what the kit's `.native` implementations actually call, and it's what every existing v2 file in this repo does. `placeholder` and `error` (string) are fine to use directly. `testID` is current everywhere.

## Theming — React Native `StyleSheet` + `theme.colors` inline

No styled-components. No `createStyles(colors)` factory. The mobile convention is:

1. `StyleSheet.create({ ... })` defined once per file (usually at the bottom), using `rawTokens` for numeric values.
2. Color tokens applied inline via `style={[styles.x, { borderColor: theme.colors.xxx }]}` — because colors depend on the active theme.

**Example** (from [src/containers/Modal/ModifyVaultModalContentV2/index.jsx](../../../src/containers/Modal/ModifyVaultModalContentV2/index.jsx)):

```jsx
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

export const Component = () => {
  const { theme } = useTheme()
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.colorSurfacePrimary,
          borderColor: theme.colors.colorBorderPrimary,
        },
      ]}
    >
      …
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing20,
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing16,
  },
})
```

Factoring styles into a sibling `*Styles.ts` module (e.g. [src/screens/CreateFolder/CreateFolderV2Styles.ts](../../../src/screens/CreateFolder/CreateFolderV2Styles.ts)) is also fine for larger screens — keep the `StyleSheet.create` + `rawTokens` pattern.

### `rawTokens` — flat, numeric-suffixed keys (numbers, not strings)

In React Native, spacing / radius / font-size values are **numbers** — no `px` suffix, no template strings.

- Spacing: `spacing2`, `spacing4`, `spacing6`, `spacing8`, `spacing10`, `spacing12`, `spacing16`, `spacing20`, `spacing24`, `spacing32`, `spacing40`, `spacing48`
- Radius: `radius8`, `radius16`, `radius20`, `radius26`
- Font size: `fontSize12`, `fontSize14`, `fontSize16`, `fontSize24`, `fontSize28`
- Font family: `fontPrimary` (`"Inter"`), `fontDisplay` (`"Humble Nostalgia"`)
- Weight: `weightRegular` (`"400"`), `weightMedium` (`"500"`)

Usage: `borderRadius: rawTokens.radius8`, `padding: rawTokens.spacing16`, `gap: rawTokens.spacing12`. No `` `${n}px` ``.

### `theme.colors` — common keys seen in this repo

`colorSurfacePrimary`, `colorSurfaceHover`, `colorBorderPrimary`, `colorBorderSecondary`, `colorTextPrimary`, `colorTextSecondary`, `colorTextTertiary`, `colorLinkText`. If you need one you haven't seen, inspect the `ThemeColors` type from `@tetherto/pearpass-lib-ui-kit`.

### When hardcoded values are OK

Tokens cover the design-system primitives. Feature-specific layout values (a card's `maxWidth: 480`, a one-off `paddingBottom: 55`) are fine as numeric literals — these aren't design tokens. **Rule of thumb:** if the value corresponds to a semantic design decision (spacing step, brand color, radius), it must come from a token.

## Icons

```tsx
import { Add, Download, Folder, OpenInNew } from '@tetherto/pearpass-lib-ui-kit/icons'
```

530 icons, mostly Material Design, with style variants as suffixes: `Filled`, `Outlined`, `Round`, `Sharp`, `Tone` (e.g. `LockFilled`, `InfoOutlined`, `KeyboardArrowRightRound`). If a name has no suffix, it exists as a single variant.

**Commonly used in this repo** (check these first before browsing):

- **Actions:** `Add`, `Download`, `ContentCopy`, `Share`, `Send`
- **Folder / organization:** `Folder`, `FolderOpen`, `CreateNewFolder`, `LayerFilled`
- **Navigation / arrows:** `KeyboardArrowRightFilled`, `KeyboardArrowLeftFilled`, `KeyboardArrowBottom`, `ExpandMore`
- **Status / feedback:** `InfoOutlined`, `ReportProblem`, `ErrorFilled`, `Check`
- **Security:** `LockOutlined`, `Key`, `SecurityFilled`, `Fingerprint`
- **Settings:** `SettingsApplicationsFilled`, `PaletteOutlined`, `Translate`, `Sync`, `Devices`, `SystemSecurityUpdateFilled`
- **Misc:** `Logout`, `Login`, `HubFilled`, `BugReportFilled`, `OpenInNew`

**Discovering others:** `ls node_modules/@tetherto/pearpass-lib-ui-kit/dist/icons/components/ | grep -i <keyword>` — names are PascalCase, grep is case-insensitive friendly.

## Anti-patterns to avoid

When editing a v2 file or creating new UI, do **not**:

- Add a new file under [src/libComponents/](../../../src/libComponents/) for a Button/Input variant.
- Import from [src/libComponents/](../../../src/libComponents/) or from `@tetherto/pearpass-lib-ui-react-native-components` in a new file — swap to the kit equivalents.
- Add a `V2` suffix to a net-new file that has no v1 sibling. Suffix is only for migration coexistence.
- Use `TouchableOpacity`, `TouchableHighlight`, or a raw `<Text>` from `react-native` for interactive UI when the kit's `Button` / `Pressable` / `Text` fit. RN primitives for layout (`View`, `StyleSheet`, `ScrollView`, `FlatList`) are fine and expected.
- Hardcode hex colors, brand radii, or design-system spacing — use `rawTokens` and `theme.colors`. (Feature-specific layout literals like `maxWidth: 480` are fine.)
- Add `px` suffixes or template-string units to token values — React Native takes numbers.
- Add new SVG files under `src/` when the kit's icons subpath covers them.
- Introduce `styled-components` — the convention is `StyleSheet.create` + `rawTokens` with colors applied inline.

When editing a v1 file and you spot these patterns, mention them to the user but **don't do drive-by rewrites** unless asked — v1 migration is scoped work.

## Reference files for patterns

- [src/screens/Settings/Vaults2/index.jsx](../../../src/screens/Settings/Vaults2/index.jsx) — kit imports, `Layout` + `PageHeader` + `Button` footer, `StyleSheet.create` at the bottom.
- [src/containers/Modal/ModifyVaultModalContentV2/index.jsx](../../../src/containers/Modal/ModifyVaultModalContentV2/index.jsx) — form with `InputField` / `PasswordField`, `AlertMessage`, full `testID` discipline, inline color theming.
- [src/screens/CreateRecord/v2/CreatePasswordItemV2.tsx](../../../src/screens/CreateRecord/v2/CreatePasswordItemV2.tsx) — password generator, `Radio` / `Slider` / `ToggleSwitch` usage.

## When the kit truly lacks something

1. Confirm by grepping `node_modules/@tetherto/pearpass-lib-ui-kit/dist/components/` for the concept.
2. Check if a composition of existing kit primitives covers it (e.g. `Pressable` + `Text` + tokens).
3. If still missing, surface it to the user: "The kit doesn't export X — options are (a) compose from Y + Z, (b) request X be added upstream, (c) temporary local component. Which?" Do not silently create (c).
