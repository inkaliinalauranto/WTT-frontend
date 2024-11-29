import styled from "styled-components";
import { theme } from "./theme";
import { SpacerProps } from "../../models/layout";
import { ResponsiveSettings } from "./responsive";


export const Layout = styled.div`
  background: ${theme.bg2};
  display: flex;
  flex-direction: column;
  max-width: 700px;
  width: 100%;
  height: 100dvh;
  align-items: center;
  justify-self: center;
  user-select: none;
  overflow-y: auto;

  & img {
    pointer-events: none;
  }
`

// ChatGPT:n antama vastaus, jolla korkeus saadaan asetettua dynaamisesti:
export const Spacer = styled.div<SpacerProps>`
 height: ${({ height }) => (`${height}px`)};
`

export const ActiveShiftText = styled.p`
  margin-top: 2em;
  margin-bottom: 4em;
  color: ${theme.green};
  font-size: small;
  font-weight: bold;

  @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
    text-align: center;
    margin-top: 0em;
    margin-bottom: 0em;
    white-space: pre-line;
  }
`

export const EmployeeTitle = styled.h1`
  margin-top: 1em;

  @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
    font-size: 1.3em;
    margin-top: 0.7em;
  }
`