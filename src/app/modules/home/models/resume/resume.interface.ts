export interface ResumeDTO {
  id: number;
  d: string;
  e: string;
  s: string;
  u: string;
  t: string;
}

export interface Resume {
  id: number;
  description: string;
  endDate: Date | null;
  startDate: Date;
  subtitle: string;
  title: string;
}

export interface ResumeTranslation {
  resume: Resume;
  translations: {
    [languageCode: string]: {
      description: string;
      title: string;
    }
  };
}

export interface ResumeWrapperDTO {
  e: ResumeDTO[];
  x: ResumeDTO[];
}

export interface ResumeWrapper {
  education: Resume[];
  experience: Resume[];
}
