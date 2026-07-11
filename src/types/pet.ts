export interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  method: "upload" | "generate";
  createdAt: string;
  image?: string;
  type?: "upload" | "generated";
  prompt?: string;
  width?: number;
  height?: number;
  transparent?: boolean;
  size?: number;
}
