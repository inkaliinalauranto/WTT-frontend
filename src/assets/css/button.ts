import styled from "styled-components";
import { theme } from "./theme";


export const BaseButton = styled.button`
  margin: 10px;
  padding: 10px;
  min-width: 150px;
  height: 50px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  color: var(--textWhite);

  &:disabled {
    background-image: linear-gradient(rgb(0 0 0/60%) 0 0);
    background-blend-mode: darken;
    opacity: 0.25;
    cursor: not-allowed;
  }
  &:disabled:hover {
    background-image: linear-gradient(rgb(0 0 0/60%) 0 0);
    background-blend-mode: darken;
    opacity: 0.25;
  }

  &:hover {
    background-image: linear-gradient(rgb(0 0 0/15%) 0 0);
    background-blend-mode: darken;
  }

  &:active {
    transform: scale(0.98);
  }

  & svg {
    fill: var(--textWhite);
  }
`

export const RedButton = styled(BaseButton)`
  background: ${theme.red};
`

export const GreenButton = styled(BaseButton)`
  background: ${theme.green};
`

export const BlueButton = styled(BaseButton)`
  background: ${theme.blue};
`
