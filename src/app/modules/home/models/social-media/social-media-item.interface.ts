export interface SocialMediaItemDTO {
  id: number;
  i: string;
  t: string;
  l: { a: string; u: string; };
}

export interface SocialMediaItem {
  id: number;
  icon: string;
  title: string;
  link: { app: string; url: string; };
}
