import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

type Props = {
  addBot: () => void;
  removeBot: () => void;
};

const BotButtonGroup = ({ addBot, removeBot }: Props) => {
  return (
    <Stack direction="horizontal" gap={2}>
      <Button className="me-1" variant="primary" onClick={addBot}>
        + Bot
      </Button>
      <Button variant="secondary" onClick={removeBot}>
        - Bot
      </Button>
    </Stack>
  );
};

export default BotButtonGroup;
