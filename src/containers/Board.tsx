import { useState, useEffect, MouseEvent, useRef } from "react";
import styled from "styled-components";
import LoginModal from "../components/Modal";
import Note from "../components/Note";
import useLogin from "../hooks/useLogin";
import useNotes from "../hooks/useNotes";
import { NoteType } from "../types";

const WhiteBoard = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 1200px;
  height: 600px;
  margin: 0 auto;
  background-color: rgb(229, 221, 221);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: visible;
  background-color: #4caf50;
  color: #ffffff;
  .heading {
    position: absolute;
    left: 40px;
    top: 20px;
    font-size: 48px;
    opacity: 0.5;
    color: #ffffff;
    cursor: default;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }
`;

const Board = () => {
  const { login, isLogin, isLoading, error, logout, userData } = useLogin();
  const [modalOpen, setModalOpen] = useState(true);
  const { notes, sendNote } = useNotes();
  const dropArea = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleLogin = (name: string) => {
    login(name);
  };
  const handleToggle = () => setModalOpen(!modalOpen);

  // create new Note when click on board
  const boardClicked = (event: MouseEvent<HTMLElement>) => {
    let rect = dropArea?.current?.getBoundingClientRect();
    let x = rect && event.clientX - rect?.left;
    let y = rect && event.clientY - rect?.top;
    if (!isDragging) {
      event.stopPropagation();
      event.preventDefault();
      if (userData && x && y) {
        const newNote = {
          type: "note",
          data: {
            userId: userData?.id,
            author: userData?.name,
            bgColor:
              "#" +
              ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
            text: "",
            placement: {
              x,
              y,
            },
          },
        };
        sendNote(newNote);
      }
    }
  };

  const dragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onNoteClicked = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    note: NoteType
  ) => {
    event.stopPropagation();
    event.preventDefault();
  };
  // when note dropped
  const dragEnd = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    note: NoteType
  ) => {
    let rect = dropArea?.current?.getBoundingClientRect();
    let x = rect && event.clientX - rect?.left;
    let y = rect && event.clientY - rect?.top;

    if (
      note?.userId === userData?.id &&
      x &&
      y &&
      x <= 1200 &&
      x >= 0 &&
      y <= 600 &&
      y >= 0
    ) {
      // event.target.style.left = `${x}px`;
      // event.target.style.top = `${y}px`;
      if (userData) {
        const newNote = {
          ...note,
          userId: userData?.id,
          author: userData?.name,
          placement: { x, y },
        };
        sendNote({ type: "note", data: newNote });
      }
    }
    setIsDragging(false);
  };
  // when text changes in note
  const handleNoteTextChange = (note: NoteType) => {
    if (userData?.id === note?.userId) {
      const newNote = {
        ...note,
        id: note?.id,
        userId: userData?.id,
      };
      sendNote({ type: "note", data: newNote });
    }
  };

  useEffect(() => {
    if (isLogin) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  }, [isLogin]);

  return !isLogin ? (
    <LoginModal
      isOpen={modalOpen}
      toggle={handleToggle}
      isLoading={isLoading}
      error={error}
      onSubmit={handleLogin}
    />
  ) : (
    <WhiteBoard
      ref={dropArea}
      className="white-board"
      onClick={boardClicked}
      onDragOver={dragOver}
    >
      <h1 className="heading">Board</h1>
      {notes?.map((note) => (
        <Note
          key={note?.id}
          note={note}
          isOwner={note?.userId === userData?.id}
          isEditable={note?.userId === userData?.id}
          onClick={(event) => onNoteClicked(event, note)}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(event) => dragEnd(event, note)}
          onTextChange={handleNoteTextChange}
          draggable={true}
        />
      ))}
    </WhiteBoard>
  );
};

export default Board;
