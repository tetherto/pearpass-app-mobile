import 'styled-components/native';

interface Color {
  mode1: string;
  option1: string;
  dark: string;
  white: string;
}

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      [key: string]: Color;
      primary400: Color;
      black: Color;
      white: Color;
      primary100: Color;
      primary200: Color;
      primary300: Color;
      primary500: Color;
      secondary100: Color;
      secondary200: Color;
      secondary300: Color;
      secondary400: Color;
      secondary500: Color;
      cyan100: Color;
      cyan200: Color;
      cyan300: Color;
      cyan400: Color;
      cyan500: Color;
      grey100: Color;
      grey200: Color;
      grey300: Color;
      grey350: Color;
      grey400: Color;
      grey500: Color;
      blue100: Color;
      blue200: Color;
      blue300: Color;
      blue400: Color;
      blue500: Color;
      categoryAll: Color;
      categoryLogin: Color;
      categoryIdentity: Color;
      categoryCreditCard: Color;
      categoryNote: Color;
      categoryCustom: Color;
      categoryPassword: Color;
      categoryWifiPassword: Color;
      categoryPassPhrase: Color;
      errorRed: Color;
      errorGreen: Color;
      errorYellow: Color;
    }
  }
}
