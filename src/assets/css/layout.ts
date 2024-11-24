import styled from "styled-components";
import { theme } from "./theme";


export const Layout = styled.div`
  background: ${theme.bg2};
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 100dvh;
  align-items: center;
  justify-self: center;
  user-select: none;
`

export const Spacer = styled.div`
  margin-top: 10px;
`