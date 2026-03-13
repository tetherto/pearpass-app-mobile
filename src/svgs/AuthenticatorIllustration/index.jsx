import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop
} from 'react-native-svg'

export const AuthenticatorIllustration = ({ width = 300, height = 190 }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 300 190"
    fill="none"
  >
    <Defs>
      <LinearGradient id="authIllCardBg" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#212814" />
        <Stop offset="50%" stopColor="#15180e" />
      </LinearGradient>
      <LinearGradient id="authIllFade" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="47%" stopColor="#15180e" stopOpacity="0" />
        <Stop offset="100%" stopColor="#15180e" />
      </LinearGradient>
      <ClipPath id="authIllClip">
        <Rect width="300" height="190" rx="10" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#authIllClip)">
      <Rect
        x="44"
        y="9"
        width="212"
        height="300"
        rx="25"
        fill="url(#authIllCardBg)"
      />

      <Rect x="52" y="46" width="196" height="37" rx="5" fill="#2c3618" />
      <Rect x="60" y="54" width="21" height="21" rx="5" fill="#37431d" />
      <Rect x="89" y="55" width="76" height="9" rx="4" fill="#37431d" />
      <Rect x="89" y="66" width="51" height="9" rx="4" fill="#37431d" />

      <Rect x="52" y="88" width="196" height="37" rx="5" fill="#2c3618" />
      <Rect x="60" y="96" width="21" height="21" rx="5" fill="#37431d" />
      <Rect x="89" y="97" width="66" height="9" rx="4" fill="#37431d" />
      <Rect x="89" y="108" width="60" height="9" rx="4" fill="#37431d" />

      <Rect x="52" y="130" width="196" height="37" rx="5" fill="#2c3618" />
      <Rect x="60" y="138" width="21" height="21" rx="5" fill="#37431d" />
      <Rect x="89" y="139" width="88" height="9" rx="4" fill="#37431d" />
      <Rect x="89" y="150" width="74" height="9" rx="4" fill="#37431d" />

      <Rect x="52" y="172" width="196" height="37" rx="5" fill="#2c3618" />
      <Rect x="60" y="180" width="21" height="21" rx="5" fill="#37431d" />
      <Rect x="89" y="181" width="76" height="9" rx="4" fill="#37431d" />
      <Rect x="89" y="192" width="51" height="9" rx="4" fill="#37431d" />

      <Rect width="300" height="190" fill="url(#authIllFade)" />
    </G>
  </Svg>
)
