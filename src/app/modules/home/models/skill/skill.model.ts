import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Skill as SkillInterface, SkillDTO, SkillTranslation as SkillTranslationInterface } from './skill.interface';

export class Skill implements SkillInterface {
  id: number;
  percentage: number;
  title: string;

  constructor(skillDTO: SkillDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = skillDTO.id;
    this.percentage = skillDTO.p;
    this.title = skillDTO.t;
  }
}

export class SkillTranslation implements SkillTranslationInterface {
  translations: { [languageCode: string]: string; };

  constructor(languageCode: LanguageCode, public skill: Skill) {
    this.translations = {
      [languageCode]: skill.title
    };
  }
}
