import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { LanguageCode } from 'ngx-material-translate';
import { Blog, BlogTranslation } from 'src/app/modules/helpers/models/blog/blog.model';

export const loadBlogs = createAction('[BLOG] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadBlogsSuccess = createAction('[BLOG] LOAD_SUCCESS', props<{ languageCode: LanguageCode, items: Blog[] }>());
export const loadBlogsFailure = createAction('[BLOG] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateBlogs = createAction('[BLOG] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateBlogsSuccess = createAction('[BLOG] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateNum<BlogTranslation>[] }>());
export const translateBlogsFailure = createAction('[BLOG] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const loadBlogContent = createAction('[BLOG] LOAD-CONTENT', props<{ path: string, name: string, languageCode: LanguageCode }>());
export const loadBlogContentSuccess = createAction('[BLOG] LOAD-CONTENT_SUCCESS', props<{ name: string, languageCode: LanguageCode, content: string }>());
export const loadBlogContentFailure = createAction('[BLOG] LOAD-CONTENT_FAILURE', props<{ name: string, languageCode: LanguageCode, error: string }>());
