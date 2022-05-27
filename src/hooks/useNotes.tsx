import { useState, useEffect } from "react";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { NoteType, SendNoteType } from "../types";
const client = new W3CWebSocket(`${process.env.REACT_APP_API_WEBSOCKET_URL}`);
const useNotes = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);

  const sendNote = (note: SendNoteType) => {
    client.send(JSON.stringify(note));
  };
  useEffect(() => {
    client.onopen = () => {
      setTimeout(() => {
        console.log("WebSocket Client Connected");
      }, 5000);
    };

    client.onmessage = (message: IMessageEvent) => {
      const dataFromServer = JSON.parse(message?.data?.toString());
      if (dataFromServer?.type === "note") {
        const prevNotes = [...notes];
        if (prevNotes?.find((n) => n.id === dataFromServer?.data?.id)) {
          const newNotes = prevNotes?.map((n) => {
            if (n.id === dataFromServer?.data?.id) {
              return dataFromServer?.data;
            }
            return n;
          });
          setNotes(Array.from(new Set([...newNotes])));
        } else {
          setNotes((prevNotes) => [...prevNotes, dataFromServer?.data]);
        }
      } else if (dataFromServer?.type === "notes") {
        setNotes((prevNotes) =>
          Array.from(new Set([...prevNotes, ...dataFromServer?.data]))
        );
      }
    };
  }, [notes]);

  return { notes, sendNote };
};
export default useNotes;
