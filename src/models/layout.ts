export type SpacerProps = {
    height: number;
  }

export type CardProps = {
  backgroundcolor: string
}

export type InspectPopupProps = {
  showPopup: boolean,
  handleCancel: () => void,
  workDateStart: Date | null,
  workDateEnd: Date | null,
  description: string
}

export type EditPopupProps = {
  showPopup: boolean,
  handleCancel: () => void,
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void,
  startTime: string,
  setStartTime: React.Dispatch<React.SetStateAction<string>>, 
  endTime: string,
  setEndTime: React.Dispatch<React.SetStateAction<string>>, 
  isLoading: boolean, 
  description: string, 
  setDescription: (value: string) => void, 
  width: number, 
  openDeletePopup: () => void
}


export type DeleteShiftPopupProps = {
  deleteConfirm: boolean, 
  close: () => void, 
  isLoading: boolean, 
  handleRemove: () => void
}

export type DeleteEmployeePopupProps = {
  isOpen: boolean, 
  close: () => void, 
  firstName: string, 
  lastName: string,
  isLoading: boolean, 
  deleteEmployee: () => void
}