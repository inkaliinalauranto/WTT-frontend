import styled from "styled-components";
import { theme } from "./theme";
import { SpacerProps } from "../../models/layout";


export const Layout = styled.div`
  background: ${theme.bg2};
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 100dvh;
  align-items: center;
  justify-self: center;
  user-select: none;

  & img {
    pointer-events: none;
  }
`

// ChatGPT:n antama vastaus, jolla korkeus saadaan asetettua dynaamisesti:
export const Spacer = styled.div<SpacerProps>`
 height: ${({ height }) => (`${height}px`)};
`