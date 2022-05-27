export interface NoteType {
  id: string;
  author: string;
  userId: string;
  bgColor: string;
  text: string;
  placement: {
    x: number;
    y: number;
  };
}
export interface SendNoteType {
  type: string;
  data: {
    id?: string;
    author: string;
    userId: string;
    bgColor: string;
    text?: string;
    placement: {
      x: number;
      y: number;
    };
  };
}

export interface UserType {
  id: string;
  name: string;
}
