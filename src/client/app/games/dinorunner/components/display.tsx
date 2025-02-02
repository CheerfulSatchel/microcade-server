import React from "react";
import styled from "styled-components";

export const StyledDisplay = styled.div<{ gameOver?: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 0 0 12px 0;
  padding: 10px 20px;
  border: 4px solid #333;
  min-height: 30px;
  overflow: none;
  min-width: 160px;
  border-radius: 20px;
  color: ${(props) => (props.gameOver ? "red" : "#999")};
  background: #000;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
`;

const Display: React.FC<{ gameOver?: boolean; text?: string }> = ({ gameOver, text }) => (
  <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
);

export default Display;
