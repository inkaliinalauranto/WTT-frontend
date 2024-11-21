import styled from "styled-components";
import { theme } from "./theme";


const BaseButton = styled.button`
  margin: 10px;
  padding: 10px;
  min-width: 150px;
  height: 50px;
  cursor: pointer;
  &:disabled {
    background: #7A2048;
    opacity: 0.5;
    cursor: not-allowed;
  }
  border: none;
  border-radius: 10px;
  font-size: 1em;
  color: var(--textWhite);
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
