import styled from "styled-components";
import { CardProps } from "../../models/layout";
import { theme } from "./theme";


export const BaseCard = styled.div<CardProps>`
    background-color: ${theme.componentBg};
    width: 100%;
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 3px 4px 0 rgba(0,0,0,0.2);
    margin-bottom: 5px;
`

export const Card = styled(BaseCard)`
  box-shadow: ${({ backgroundcolor }) => (`inset 0 0 0px 2px  ${backgroundcolor}`)};
  
  &:hover {
        box-shadow: inset 0 0 0 2px rgba(0,0,0,0.6);
    }
`
