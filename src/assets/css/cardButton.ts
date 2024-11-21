import styled from "styled-components";
import { theme } from "./theme";


export const CardButton = styled.button`
    background-color: ${theme.componentBg};
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.2);
    margin-bottom: 5px;
`
