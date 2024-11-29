import styled from "styled-components";
import { ResponsiveSettings } from "./responsive";

interface AccountTopBarProps {
  direction?: "row" | "column"; // Flex direction
  justifycontent?: "center" | "space-between" | "flex-start" | "flex-end"; // Justify content
  alignItems?: "center" | "flex-start" | "flex-end"; // Alignment
}

export const AccountTopBar = styled.div<AccountTopBarProps>`
  background: ${({ theme }) => theme.bg2};
  display: flex;
  width: 100%;
  height: 100px;
  flex-direction: ${({ direction = "row" }) => direction};
  justify-content: ${({ justifycontent = "space-between" }) => justifycontent};
  align-items: ${({ alignItems = "center" }) => alignItems};
  padding: 30px;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  & button {
    margin: 0px
  }

  @media screen and (max-width: ${ResponsiveSettings.smallScreenMaxWidth}) {
    font-size: 0.7em;
    padding: 0;
    gap: 30px;


    button {
      margin:10px;
    }
    h1, p {
      text-align: left;
      margin-left: 10px;
      margin-right: 70px;
    }
  }
`;
