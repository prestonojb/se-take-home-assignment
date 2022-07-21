import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

type Order = {
  id: number;
  botId?: number;
  status: "PENDING" | "COMPLETE";
  type: "Normal" | "VIP";
};

const App = () => {
  const [nextOrderId, setNextOrderId] = useState<number>(1001);
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (type: Order["type"]) => {
    const newOrder: Order = { id: nextOrderId, status: "PENDING", type };
    setNextOrderId(nextOrderId + 1);
    setOrders((currentOrders) => [...currentOrders, newOrder]);
  };

  return (
    <>
      {orders.map((order) => (
        <div>
          {"Order " + order.id} {order.type == "VIP" && "(VIP)"}
        </div>
      ))}
      <button onClick={() => addOrder("Normal")}>Add Normal Order</button>
      <button onClick={() => addOrder("VIP")}>- Add VIP Order</button>
      <button></button>
    </>
  );
};

export default App;
