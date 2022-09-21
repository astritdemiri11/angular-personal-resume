import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  UserReview as UserReviewInterface,
  UserReviewDTO,
  UserReviewTranslation as UserReviewTranslationInterface,
} from './user-review.interface';

export class UserReview implements UserReviewInterface {
  id: number;
  fullName: string;
  description: string;
  image: string;
  profession: string;

  constructor(userReviewDTO: UserReviewDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = userReviewDTO.id;
    this.fullName = userReviewDTO.f;
    this.description = userReviewDTO.d;
    this.image = userReviewDTO.i;
    this.profession = userReviewDTO.p;
  }
}

export class UserReviewTranslation implements UserReviewTranslationInterface {
  translations: { [languageCode: string]: { description: string; profession: string }; };

  constructor(languageCode: LanguageCode, public userReview: UserReview) {
    this.translations = {
      [languageCode]: {
        description: userReview.description,
        profession: userReview.profession
      }
    };
  }
}
