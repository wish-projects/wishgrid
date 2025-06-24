export type LayoutType = "grid" | "collage" | "polaroid";

export interface MoodboardImage {
  id: number;
  src: {
    large: string;
    medium: string;
    small: string;
  };
  photographer: string;
  alt: string;
}
