export interface Pet {
  id: string;
  name: string;
  image: string; // URL or base64 string
  type: "upload" | "generated";
  prompt?: string;
  width: number;
  height: number;
  transparent: boolean;
  size: number;
  createdAt: string;
}
