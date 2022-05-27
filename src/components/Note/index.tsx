import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { NoteType } from "../../types";
import { useDebounce } from "use-debounce";
import styled from "styled-components";

interface NoteCardProps {
  isOwner: boolean;
  bColor: string;
}

const NoteCard = styled.div<NoteCardProps>`
  position: absolute;
  width: 250px;
  max-width: 250px;
  height: 250px;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props) => props.bColor || "rgb(229, 224, 127)"};
  border: ${(props) =>
    props.isOwner ? "2px solid #0f3ae8" : " 1px solidrgb(173, 168, 168)"};
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.406);
  padding: 10px;
  cursor: move;
  z-index: 1;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box; /* Opera/IE 8+ */

  h5 {
    display: inline-block;
    text-align: left;
    width: 100%;
    max-width: 100%;
    height: auto;
    margin: 5px 0 15px 0;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    word-wrap: break-word;
  }
  textarea {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 14px;
    color: #000000;
    word-wrap: break-word;
    resize: none;
    background-color: rgb(227, 224, 180);
    &:focus {
      outline-color: #6ed073;
    }
  }
`;

interface Props {
  note: NoteType;
  isOwner: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onDragStart?: (event: MouseEvent<HTMLElement>) => void;
  onDragEnd?: (event: MouseEvent<HTMLElement>) => void;
  draggable: boolean | undefined;
  isEditable: boolean | undefined;
  onTextChange: (note: NoteType) => void;
}

const Note: React.FC<Props> = ({
  note,
  isOwner,
  onClick,
  onDragStart,
  onDragEnd,
  onTextChange,
  draggable,
  isEditable,
}) => {
  const { author, text, placement, bgColor } = note;
  const [textValue, setTextValue] = useState("");
  const [value] = useDebounce(textValue, 1000);
  const allowedTextChanges = useRef<boolean>(false);
  const handleChange = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const { value } = event.target;
    setTextValue(value);
  };

  useEffect(() => {
    if (allowedTextChanges.current && value !== undefined) {
      onTextChange({ ...note, text: value });
    } else allowedTextChanges.current = true;
  }, [value]);
  useEffect(() => {
    setTextValue(text);
  }, [text]);

  return (
    <NoteCard
      isOwner={isOwner}
      bColor={bgColor}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{ left: placement?.x, top: placement?.y }}
    >
      <h5>Author: {author}</h5>
      <textarea
        disabled={!isEditable}
        onChange={handleChange}
        value={textValue}
      />
    </NoteCard>
  );
};

export default Note;
