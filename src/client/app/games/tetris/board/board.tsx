import React from "react";
import styled from "styled-components";

import Cell from "./Cell";

export const StyledStage = styled.div<{ width?: number; height?: number }>`
  display: grid;
  grid-template-rows: repeat(${(props) => props.height}, 28px);
  grid-template-columns: repeat(${(props) => props.width}, 28px);
  grid-gap: 1px;
  border: 2px solid #333;
  max-width: 25vw;
  background: #111;
`;

const Stage = ({ stage }) => (
  <StyledStage width={stage[0].length} height={stage.length}>
    {stage.map((row) => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
  </StyledStage>
);

export default Stage;
