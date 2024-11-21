import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 16px;
  font-family: Arial, sans-serif;
  color: black;
`;

export const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #3498db; /* Blue color */
  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    transform: scale(0.95);
  }

  & svg {
    fill: white;
  }
`;


export const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;
    padding-top: 20px;
`;

export const LeftAligned = styled.div`
    position: absolute;
    left: 0;
`;

export const CenterAligned = styled.div`
    margin: 0 auto;
    text-align: center;
`;


