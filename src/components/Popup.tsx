import React from "react";
import {PopupContainer, PopupContent, PopupHeader, PopupOverlay, PopupBackground, PopupFooter } from "../assets/css/popup";

interface PopupProps {
  isOpen: boolean; // Controls visibility
  title?: string; // Optional title
  children?: React.ReactNode; // Content of the popup
  width?: string; // Custom width
  height?: string; // Custom height
  onBackGroundClick?: () => void
  footerContent?: React.ReactNode; // Content of the footer
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  title,
  children,
  footerContent,
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
        <PopupFooter>{footerContent}</PopupFooter>
      </PopupContainer>
    </PopupOverlay>
  </>
};
