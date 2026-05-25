/**
 * V1 color palette, inlined locally to drop the
 * `@tetherto/pearpass-lib-ui-theme-provider` dependency (which transitively
 * pulled in `styled-components`). Each entry has `mode1` plus optional
 * `option1`, `dark`, `white` slots — same shape consumers expect.
 */

const c = (mode1, option1, dark, white) => ({
  mode1,
  option1: option1 ?? mode1,
  dark: dark ?? mode1,
  white: white ?? mode1
})

export const colors = {
  black: c('#050B06'),
  white: c('#F6F6F6'),
  primary100: c('#949A83'),
  primary200: c('#99A578'),
  primary300: c('#A3BB62'),
  primary400: c('#BADE5B', '#B0D944', '#B0D944', '#B0D944'),
  primary500: c('#B2DD40'),
  secondary100: c('#A5BFC0'),
  secondary200: c('#779FA1'),
  secondary300: c('#5F8587'),
  secondary400: c('#2A3B3C'),
  secondary500: c('#202C2D'),
  cyan100: c('#98A7AB'),
  cyan200: c('#8FADB4'),
  cyan300: c('#85B3BE'),
  cyan400: c('#73BED0'),
  cyan500: c('#60CAE3'),
  grey100: c('#BABABA'),
  grey200: c('#999999'),
  grey300: c('#666666'),
  grey350: c('#393939'),
  grey400: c('#303030'),
  grey500: c('#232323'),
  blue100: c('#C3D4EB'),
  blue200: c('#BCD3F2'),
  blue300: c('#8CB8F2'),
  blue400: c('#478DEB'),
  blue500: c('#1970E6'),
  categoryAll: c('#779FA1', '#2A8962', '#7AAF7B', '#7AAF7B'),
  categoryLogin: c('#D567FA', '#A0996B', '#E6AA68', '#6E9700'),
  categoryIdentity: c('#D65C5E', '#E5ED97', '#E9BCB7', '#C2E2AA'),
  categoryCreditCard: c('#8A63FF', '#CECECE', '#BEBEBE', '#E6E8AC'),
  categoryNote: c('#F2BA40', '#8FBC7F', '#6E9700', '#2A8962'),
  categoryCustom: c('#496FF9', '#496FF9', '#C3A2D2', '#ACB1E8'),
  categoryPassword: c('#ED8E1A', '#ED8E1A', '#9ACEBF', '#F6DC85'),
  categoryWifiPassword: c('#779FA1', '#2A8962', '#F3EF72', '#7AAF9B'),
  categoryPassPhrase: c('#779FA1', '#2A8962', '#55C357', '#7AAF9B'),
  errorRed: c('#D13B3D', '#D13B3D', '#D65C5E', '#D65C5E'),
  errorGreen: c('#76D944'),
  errorYellow: c('#FFAE00', '#F2BA40', '#F2BA40', '#F2BA40')
}

/**
 * Passthrough stub for the V1 ThemeProvider. Migrated code no longer reads
 * theme via context (it imports `colors` directly), so this is a no-op
 * wrapper kept around so existing call-sites and tests don't have to change.
 */
export const ThemeProvider = ({ children }) => children
