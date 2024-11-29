import styled from "styled-components";
import { ResponsiveSettings } from "./responsive";
import { theme } from "./theme";


export const SlidersDiv = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
        position: fixed;
        height: 30px;
        background-color: ${theme.bg2};
        bottom: 0;
    }
`