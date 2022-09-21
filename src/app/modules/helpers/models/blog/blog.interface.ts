export interface BlogDTO {
  id: number;
  c: string;
  d: string;
  i: string;
  l: string;
  n: string;
  b: string;
  v: boolean;
}

export interface Blog {
  id: number;
  content: string;
  creator: string;
  date: Date;
  description: string;
  image: string;
  link: string;
  name: string;
  videoMode: boolean;
}

export interface BlogTranslation {
  blog: Blog;
  content: {
    [languageCode: string]: string;
  };
  translations: {
    [languageCode: string]: string
  };
}
