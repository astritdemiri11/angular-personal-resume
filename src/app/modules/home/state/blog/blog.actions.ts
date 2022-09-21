import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { Blog } from 'src/app/modules/helpers/models/blog/blog.interface';
import { BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.model';



export const loadBlogs = createAction('[HOME_BLOG] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadBlogsSuccess = createAction('[HOME_BLOG] LOAD_SUCCESS', props<{ languageCode: LanguageCode, blogs: Blog[] }>());
export const loadBlogsFailure = createAction('[HOME_BLOG] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateBlogs = createAction('[HOME_BLOG] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateBlogsSuccess = createAction('[HOME_BLOG] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<BlogTranslation>[] }>());
export const translateBlogsFailure = createAction('[HOME_BLOG] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());
