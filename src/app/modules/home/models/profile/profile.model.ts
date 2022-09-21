import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Profile as ProfileInterface, ProfileTranslation as ProfileTranslationInterface, ProfileDTO } from './profile.interface';

export class Profile implements ProfileInterface {
  name: string;
  surname: string;
  bio: string;
  birthday: Date;
  profession: string;
  languages: string[];

  constructor(profileDTO: ProfileDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.name = profileDTO.n;
    this.surname = profileDTO.s;
    this.bio = profileDTO.b;
    this.birthday = new Date(profileDTO.d);
    this.profession = profileDTO.p;
    this.languages = profileDTO.l;
  }
}

export class ProfileTranslation implements ProfileTranslationInterface {
  translations: { [languageCode: string]: { bio: string; profession: string }; };

  constructor(languageCode: LanguageCode, public profile: Profile) {
    this.translations = {
      [languageCode]: {
        bio: profile.bio,
        profession: profile.profession
      }
    };
  }
}
