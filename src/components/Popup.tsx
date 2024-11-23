import React from "react";
import {PopupContainer, PopupContent, PopupFooter, PopupHeader, PopupOverlay } from "../assets/css/popup";

interface PopupProps {
  isOpen: boolean; // Controls visibility
  title?: string; // Optional title
  children?: React.ReactNode; // Content of the popup
  width?: string; // Custom width
  height?: string; // Custom height
  footerContent?: React.ReactNode; // Content of the footer
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  title,
  children,
  footerContent,
  width,
  height,
}) => {
  if (!isOpen) return null;

  return (
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
  );
};
