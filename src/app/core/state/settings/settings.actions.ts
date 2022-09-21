import { createAction, props } from '@ngrx/store';

import { ThemeType } from '../../models/theme/theme.enum';

export const presetTheme = createAction('[CORE_SETTINGS] PRESET_THEME', props<{ theme: ThemeType }>());
export const setTheme = createAction('[CORE_SETTINGS] SET_THEME', props<{ theme: ThemeType }>());
export const setLinkAppMode = createAction('[CORE_SETTINGS] SET_LINK-APP-MODE', props<{ appMode: boolean }>());
