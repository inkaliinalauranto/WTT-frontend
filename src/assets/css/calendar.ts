import styled from "styled-components";
import { ResponsiveSettings } from "./responsive";

export const Calendar = styled.div`
    width: 100%;
    padding: 0 30px 0 30px;
    margin-top: 2em;

    @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
        padding: 0 5px 0 5px;
    }
    margin-top: 1em;
`
