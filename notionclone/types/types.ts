import { DocumentData } from "firebase/firestore";

export type User = {
  email: string;
  fullName: string;
  image: string;
};

export type RoomDocument = DocumentData & {
  userId: string;
  roomId: string;
  role: "owner" | "editor" | "viewer";
  createdAt: Date;
};
