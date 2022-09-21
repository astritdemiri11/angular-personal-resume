export interface SkillDTO {
  id: number;
  p: number;
  t: string;
}

export interface Skill {
  id: number;
  percentage: number;
  title: string;
}

export interface SkillTranslation {
  skill: Skill;
  translations: {
    [languageCode: string]: string
  };
}
