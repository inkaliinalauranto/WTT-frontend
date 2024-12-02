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
