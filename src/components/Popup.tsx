import React from "react";
import {PopupContainer, PopupContent, PopupHeader, PopupOverlay, PopupBackground } from "../assets/css/popup";

interface PopupProps {
  isOpen: boolean; // Controls visibility
  title?: string; // Optional title
  children?: React.ReactNode; // Content of the popup
  width?: string; // Custom width
  height?: string; // Custom height
  onBackGroundClick?: () => void
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  title,
  children,
  width,
  height,
  onBackGroundClick,
}) => {
  if (!isOpen) return null;

  return <>
    <PopupBackground onClick={onBackGroundClick}/>
    <PopupOverlay>
      <PopupContainer width={width} height={height}>
        {title && (
          <PopupHeader>
            {title}
          </PopupHeader>
        )}
        <PopupContent>{children}</PopupContent>
      </PopupContainer>
    </PopupOverlay>
  </>
};
