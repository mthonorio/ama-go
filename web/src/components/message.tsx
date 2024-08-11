import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { createMessageReaction } from "../http/create-message-reaction";
import { toast } from "sonner";
import { removeMessageReaction } from "../http/remove-message-reaction";

interface MessageProps {
  id: string;
  text: string;
  amountOfReactions: number;
  answered?: boolean;
}

export function Message({
  id: messageId,
  text,
  amountOfReactions,
  answered = false,
}: MessageProps) {
  const { roomId } = useParams();
  const [hasReacted, setHasReacted] = useState(false);

  if (!roomId) {
    throw new Error(
      "Room ID is required and messages components must be used within room page!"
    );
  }

  function handleReactToMessage() {
    setHasReacted(!hasReacted);
  }

  async function createMessageReactionAction() {
    if (!roomId) {
      return;
    }

    try {
      await createMessageReaction({ messageId, roomId });
    } catch (error) {
      console.log(error);
      toast.error("Falha ao reagir, tente novamente!");
    }

    setHasReacted(true);
  }

  async function removeMessageReactionAction() {
    if (!roomId) {
      return;
    }

    try {
      await removeMessageReaction({ messageId, roomId });
    } catch (error) {
      console.log(error);
      toast.error("Falha ao remover reação, tente novamente!");
    }

    setHasReacted(false);
  }

  return (
    <li
      data-answered={answered}
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}
      {hasReacted ? (
        <button
          type="button"
          onClick={removeMessageReactionAction}
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      ) : (
        <button
          type="button"
          onClick={createMessageReactionAction}
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      )}
    </li>
  );
}
