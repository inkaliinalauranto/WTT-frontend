import styled, { keyframes } from 'styled-components';


// Define the keyframes for the animation
const popUpFadeIn = keyframes`
  from {
    bottom: -100px;
    opacity: 0;
  }
  to {
    opacity: 1;
    bottom: 0px;
  }
`;

// Define the keyframes for the animation
const tintFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PopupBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); // Semi-transparent background
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
  animation: ${tintFadeIn} 0.2s forwards;
`;

export const PopupContainer = styled.div<{ width?: string; height?: string }>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: ${({ width }) => width || "400px"};
  height: ${({ height }) => height || "auto"};
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  pointer-events: all;
  animation: ${popUpFadeIn} 0.1s forwards;
`;


export const PopupHeader = styled.div`
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PopupContent = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PopupFooter = styled.div`
  margin-top: 0px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
