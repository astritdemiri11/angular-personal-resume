export interface UserReviewDTO {
  id: number;
  d: string;
  f: string;
  i: string;
  p: string;
}

export interface UserReview {
  id: number;
  description: string;
  fullName: string;
  image: string;
  profession: string;
}

export interface UserReviewTranslation {
  userReview: UserReview;
  translations: {
    [languageCode: string]: {
      description: string;
      profession: string;
    }
  };
}
