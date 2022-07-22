import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { Order } from "../constants/types";

type Props = {
  addOrder: (type: Order["type"]) => void;
};

const OrderButtonGroup = ({ addOrder }: Props) => {
  return (
    <Stack direction="horizontal" gap={2}>
      <Button variant="primary" onClick={() => addOrder("Normal")}>
        New Normal Order
      </Button>
      <Button variant="secondary" onClick={() => addOrder("VIP")}>
        New VIP Order
      </Button>
    </Stack>
  );
};

export default OrderButtonGroup;
