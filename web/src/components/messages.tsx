import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages } from "../http/get-room-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMessagesWebSocket } from "../hooks/use-messages-web-socket";

export function Messages() {
  const { roomId } = useParams();

  if (!roomId) {
    throw new Error(
      "Room ID is required and messages components must be used within room page!"
    );
  }

  // This is a custom hook that fetches messages from the API on React 19!
  // const { messages } = use(getRoomMessages({ roomId }));
  // console.log(messages);

  const { data } = useSuspenseQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getRoomMessages({ roomId }),
  });

  useMessagesWebSocket({ roomId });

  const sortedMessages = data.messages.sort((a, b) => {
    return b.amountOfReactions - a.amountOfReactions;
  });

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {sortedMessages.map((message) => {
        return (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            amountOfReactions={message.amountOfReactions}
            answered={message.answered}
          />
        );
      })}
    </ol>
  );
}
