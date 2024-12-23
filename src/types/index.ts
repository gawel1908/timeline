export type Card = {
  id?: number;
  title: string;
  value: number;
};
export type CardPlaceholder = {
  value: number;
};

export type Achievement = {
  name: string;
  description: string;
  score: number;
};

export type Player = {
  name: string;
  level: number;
  totalScore: number;
  achievements: Achievement[];
};
