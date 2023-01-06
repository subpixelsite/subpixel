export interface PostData {
  id: number;
  title: string;
  author: string;
  dateCreated: number;
  tags: string[];
  hdrWGL: string; // First priority
  hdrSVG: string; // Second priority
  hdrImg: string; // Third priority
  hdrAlt: string; // Alt text for header visual
  description: string;
  body: string;
}
