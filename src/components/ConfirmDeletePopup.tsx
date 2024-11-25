import React from "react";
import { Popup } from "./Popup"; // Adjust the path to where your Popup component is located
import { GreenButton, RedButton } from "../assets/css/button";
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';


/*


Poistettu käytöstä
Poistettu käytöstä
Poistettu käytöstä


*/

interface ConfirmDeletePopupProps {
  isOpen: boolean; // Controls visibility
  onConfirm: () => void; // Callback for confirming delete
  onCancel: () => void; // Callback for canceling
  title?: string; // Optional title, default provided
  message?: string; // Optional message inside the popup
}

export const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  return (
    <Popup
      onBackGroundClick={onCancel}
      isOpen={isOpen}
      title={title}
      footerContent={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <GreenButton onClick={onCancel}>
            <UndoIcon/>&nbsp;Takaisin
          </GreenButton>
          <RedButton onClick={onConfirm}>
            <DeleteIcon/>&nbsp;Poista
          </RedButton>
        </div>
      }
    > 
      {/*Whitespacen ansiosta voidaan käyttää \n merkkejä rivin katkaisemiseen */}
      <p style={{whiteSpace: "pre-line"}}>{message}</p>
    </Popup>
  );
};
