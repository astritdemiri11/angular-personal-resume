export interface ProfileDTO {
  n: string;
  s: string;
  b: string;
  d: string;
  p: string;
  l: string[];
}

export interface Profile {
  name: string;
  surname: string;
  bio: string;
  birthday: Date;
  profession: string;
  languages: string[];
}

export interface ProfileTranslation {
  profile: Profile;
  translations: {
    [languageCode: string]: {
      bio: string;
      profession: string;
    }
  };
}
