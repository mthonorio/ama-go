import { GetRoomMessageResponse, Message } from "../types";

interface GetRoomMessageProps {
  roomId: string;
}

export async function getRoomMessages({
  roomId,
}: GetRoomMessageProps): Promise<GetRoomMessageResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages`
  );

  const data: Message[] = await response.json();

  return {
    messages: data.map((msg) => {
      return {
        id: msg.ID,
        text: msg.Message,
        amountOfReactions: msg.ReactionCount,
        answered: msg.Answered,
      };
    }),
  };
}
