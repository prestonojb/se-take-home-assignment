import { Bot, Order } from "../constants/types";

type Props = {
  idx: number;
  order: Order;
  bot: Bot | undefined;
};

const OrderLine = ({ idx, order, bot }: Props) => {
  return (
    <div key={idx}>
      {"Order " + order.id} {order.type === "VIP" && "(VIP)"}{" "}
      {bot !== undefined && `(Bot ${bot.id})`}
    </div>
  );
};

export default OrderLine;
