import { Action, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromBlogReducer from './blog/blog.reducer';
import * as fromContactReducer from './contact/contact.reducer';
import * as fromPortfolioReducer from './portfolio/portfolio.reducer';
import * as fromProductReducer from './product/product.reducer';
import * as fromProfileReducer from './profile/profile.reducer';
import * as fromResumeReducer from './resume/resume.reducer';
import * as fromSkillReducer from './skill/skill.reducer';
import * as fromSocialMediaReducer from './social-media/social-media.reducer';
import * as fromUserReviewReducer from './user-review/user-review.reducer';

export interface State {
  [fromBlogReducer.featureKey]: fromBlogReducer.State,
  [fromContactReducer.featureKey]: fromContactReducer.State,
  [fromPortfolioReducer.featureKey]: fromPortfolioReducer.State,
  [fromProductReducer.featureKey]: fromProductReducer.State,
  [fromProfileReducer.featureKey]: fromProfileReducer.State,
  [fromResumeReducer.featureKey]: fromResumeReducer.State,
  [fromSkillReducer.featureKey]: fromSkillReducer.State,
  [fromSocialMediaReducer.featureKey]: fromSocialMediaReducer.State,
  [fromUserReviewReducer.featureKey]: fromUserReviewReducer.State
}

export const reducers: ActionReducerMap<State, Action> = {
  [fromBlogReducer.featureKey]: fromBlogReducer.reducer,
  [fromContactReducer.featureKey]: fromContactReducer.reducer,
  [fromPortfolioReducer.featureKey]: fromPortfolioReducer.reducer,
  [fromProductReducer.featureKey]: fromProductReducer.reducer,
  [fromProfileReducer.featureKey]: fromProfileReducer.reducer,
  [fromResumeReducer.featureKey]: fromResumeReducer.reducer,
  [fromSkillReducer.featureKey]: fromSkillReducer.reducer,
  [fromSocialMediaReducer.featureKey]: fromSocialMediaReducer.reducer,
  [fromUserReviewReducer.featureKey]: fromUserReviewReducer.reducer
};

export const featureKey = 'home';

export const selectHomeState = createFeatureSelector<State>(featureKey);
