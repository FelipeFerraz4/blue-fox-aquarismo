export interface CarouselSlide {
  id: string | number;
  image: string;
  title: string;
  description: string;
  button?: {
    text: string;
    link: string;
  };
}
