import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { Bot, Order } from "../constants/types";

import OrderLine from "./OrderLine";

type Props = {
  orders: Order[];
  orderSort?: (a: Order, b: Order) => number;
  status: Order["status"];
  getOrderBot: (orderId: number) => Bot | undefined;
};

const OrderGroup = ({ orders, orderSort, status, getOrderBot }: Props) => {
  return (
    <>
      <h2>{status}</h2>
      <div className="p-4 bg-light">
        {orders
          .filter((order) => order.status === status)
          .sort(orderSort !== undefined ? orderSort : () => 0)
          .map((order, idx) => (
            <OrderLine idx={idx} order={order} bot={getOrderBot(order.id)} />
          ))}
      </div>
    </>
  );
};

export default OrderGroup;
