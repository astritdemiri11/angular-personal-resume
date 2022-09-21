import { ThemeType } from "../models/theme/theme.enum";

const themeColorMap: { [key: string]: { dark: boolean, primaryName: string, defaultColor: string, textColor: string } } = {
  [ThemeType.DarkGreyCyan]: { dark: true, primaryName: 'darkGrey', defaultColor: '#070d1b', textColor: '#8F979F' },
  [ThemeType.DarkBlueBlue]: { dark: true, primaryName: 'darkBlue', defaultColor: '#27304e', textColor: '#C6F8FF' },
  [ThemeType.LightPinkLightBlue]: { dark: false, primaryName: 'lightPink', defaultColor: '#fdd9d9', textColor: '#948080' },
  [ThemeType.LightYellowPurple]: { dark: false, primaryName: 'lightYellow', defaultColor: '#fff9cc', textColor: '#999786' }
}

export const THEME_COLOR_MAP = { ...themeColorMap };
