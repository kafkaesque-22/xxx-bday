export interface ColorScheme {
  from: string;
  via: string;
  to: string;
  accent: string;
  text: string;
}

export interface ReasonItem {
  id: number;
  title: string;
  description: string;
  emoji: string;
  image: string;
  color: ColorScheme;
  tag: string;
}
