export interface Message {
  ID: string;
  RoomID: string;
  Message: string;
  ReactionCount: number;
  Answered: boolean;
}

export interface GetRoomMessageResponse {
  messages: {
    id: string;
    text: string;
    amountOfReactions: number;
    answered: boolean;
  }[];
}