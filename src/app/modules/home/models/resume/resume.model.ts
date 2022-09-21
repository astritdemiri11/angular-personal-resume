import { LanguageCode } from 'ngx-material-translate';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import {
  Resume as ResumeInterface,
  ResumeDTO,
  ResumeTranslation as ResumeTranslationInterface,
  ResumeWrapper as ResumeWrapperInterface,
  ResumeWrapperDTO,
} from './resume.interface';

export class Resume implements ResumeInterface {
  id: number;
  startDate: Date;
  endDate: Date | null;
  title: string;
  subtitle: string;
  description: string;

  constructor(resumeDTO: ResumeDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.id = resumeDTO.id;
    this.startDate = new Date(resumeDTO.s);
    this.endDate = resumeDTO.e ? new Date(resumeDTO.e) : null;
    this.subtitle = resumeDTO.u;
    this.description = resumeDTO.d;
    this.title = resumeDTO.t;
  }
}

export class ResumeTranslation implements ResumeTranslationInterface {
  translations: { [languageCode: string]: { description: string; title: string }; };

  constructor(languageCode: LanguageCode, public resume: Resume) {
    this.translations = {
      [languageCode]: {
        description: resume.description,
        title: resume.title
      }
    };
  }
}

export class ResumeWrapper implements ResumeWrapperInterface {
  education: Resume[];
  experience: Resume[];

  constructor(resumeTypeDTO: ResumeWrapperDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.education = resumeTypeDTO.e ? resumeTypeDTO.e.map(educationDTO => new Resume(educationDTO)) : [];
    this.experience = resumeTypeDTO.x ? resumeTypeDTO.x.map(experienceDTO => new Resume(experienceDTO)) : [];
  }
}
