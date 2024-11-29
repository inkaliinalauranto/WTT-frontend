import styled from "styled-components";
import { ResponsiveSettings } from "./responsive";


export const CardsLayout = styled.div`
    width: 100%;
    padding: 10px;
    overflow-y: auto;
    box-sizing: border-box;

    @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
    font-size: 0.8em;
    padding: 5px;
  }
`