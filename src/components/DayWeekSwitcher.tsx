import { ArrowButton, Container } from '../assets/css/DayWeekSwitcher';


const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

interface DayWeekSwitcherProps {
  onLeftClick?: () => void; // Optional prop for left click handler
  onRightClick?: () => void; // Optional prop for right click handler
  date?: string;
}



const DayWeekSwitcher: React.FC<DayWeekSwitcherProps> = ({
  onLeftClick,
  onRightClick,
  date
}) => {
  return (
    <Container>
      <ArrowButton onClick={onLeftClick}>
        <ArrowLeft />
      </ArrowButton>
      <div>{date}</div>
      <ArrowButton onClick={onRightClick}>
        <ArrowRight />
      </ArrowButton>
    </Container>
  );
};

export default DayWeekSwitcher;
