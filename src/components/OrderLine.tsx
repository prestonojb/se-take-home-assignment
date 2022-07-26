import { Bot, Order } from "../constants/types";

type Props = {
  idx: number;
  order: Order;
  bot: Bot | undefined;
};

const OrderLine = ({ idx, order, bot }: Props) => {
  let remark = "";
  if (bot !== undefined) {
    remark += `(Processing by Bot ${bot.id}...`;
    if (bot.msLeft !== undefined) {
      remark += ` ${(bot.msLeft / 1000).toFixed(0)}s left`;
    }
    remark += ")";
  }
  return (
    <div key={idx}>
      {"Order #" + order.id} {order.type === "VIP" && "(VIP)"} {remark}
    </div>
  );
};

export default OrderLine;
