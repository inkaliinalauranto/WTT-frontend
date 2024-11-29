import styled from "styled-components";
import { BaseButton } from "./button";
import { theme } from "./theme";


export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 16px;
  font-family: Arial, sans-serif;
  color: black;
`;

export const ArrowButton = styled(BaseButton)`
  margin: 0px;
  padding: 0px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${theme.schedulerButton};
  border-radius: 50%;
`;


export const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;
`;

export const LeftAligned = styled.div`
    position: relative;
    left: 0;
`;

export const CenterAligned = styled.div`
    margin: 0 auto;
    text-align: center;
`;

export const RightAligned = styled.div`
    position: relative;
    right: 0;
`;
