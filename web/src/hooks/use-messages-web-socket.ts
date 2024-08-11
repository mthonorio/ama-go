import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { GetRoomMessageResponse } from "../types";

interface UseMessagesWebSocketParams {
  roomId: string;
}

type WebHookMessage = 
  | {
      kind: "message_created";
      value: {
        id: string;
        message: string;
      };
    }
  | {
      kind: "message_reaction_increased" | "message_reaction_decreased";
      value: {
        id: string;
        count: number;
      };
    }
  | {
      kind: "message_answered";
      value: {
        id: string;
      };
    };

export function useMessagesWebSocket({
  roomId,
}: UseMessagesWebSocketParams) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);

    ws.onopen = () => {
      console.log("Connected to websocket server");
    };

    ws.onclose = () => {
      console.log("Disconnected from websocket server");
    };

    ws.onmessage = (event) => {
      const data:WebHookMessage = JSON.parse(event.data);

      switch (data.kind) {
        case "message_created": {
          queryClient.setQueryData<GetRoomMessageResponse>(
            ["messages", roomId],
            (oldData) => {
              return {
                messages: [
                  ...(oldData?.messages ?? []),
                  {
                    id: data.value.id,
                    text: data.value.message,
                    amountOfReactions: 0,
                    answered: false,
                  },
                ],
              };
            }
          );
          break;
        }
        case "message_answered": {
          queryClient.setQueryData<GetRoomMessageResponse>(
            ["messages", roomId],
            (oldData) => {
              if (!oldData) {
                return undefined;
              }

              return {
                messages: oldData.messages.map((message) => {
                  if (message.id === data.value.id) {
                    return {
                      ...message,
                      answered: true,
                    };
                  }

                  return message;
                }),
              };
            }
          );
          break;
        }
        case "message_reaction_increased":
        case "message_reaction_decreased": {
          queryClient.setQueryData<GetRoomMessageResponse>(
            ["messages", roomId],
            (oldData) => {
              if (!oldData) {
                return undefined;
              }

              return {
                messages: oldData.messages.map((message) => {
                  if (message.id === data.value.id) {
                    return {
                      ...message,
                      amountOfReactions: data.value.count,
                    };
                  }

                  return message;
                }),
              };
            }
          );
          break;
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId, queryClient]);
}