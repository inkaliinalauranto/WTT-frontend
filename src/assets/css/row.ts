import styled from "styled-components";
import { ResponsiveSettings } from "./responsive";

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; /* Align items vertically in the center */
  justify-content: space-between; /* Spread the items across the row */
  width: 100%; /* Full width */
  margin-top: 40px;
`;

export const ShiftOperationsRow = styled.div`
 display: flex;
 flex-direction: row;
 margin-top: 30px;

  @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
    margin-top: 10px;
  }
`

export const EmployeeCardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`