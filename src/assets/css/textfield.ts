import styled from "styled-components";
import { theme } from "./theme";


export const Textfield = styled.input`
  margin: 5px;
  padding: 10px;
  background: ${theme.componentBg};
  max-width: 300px;
  height: 50px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 3px 4px 0 rgba(0,0,0,0.2);
  font-size: 1.5em;
  text-align: center;
`
