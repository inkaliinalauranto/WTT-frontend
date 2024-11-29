import styled from "styled-components";
import { theme } from "./theme";
import { ResponsiveSettings } from "./responsive";


export const BaseButton = styled.button`
  display: flex; 
  margin: 10px;
  padding: 10px;
  min-width: 150px;
  height: 50px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  color: var(--textWhite);
  justify-content: center;
  align-items: center;

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

  @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
    min-width: 0px;
    width: 50px;
    font-size: 0;
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
