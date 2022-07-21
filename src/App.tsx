import React, { useState, useEffect, useRef } from "react";
import "./App.css";

type Order = {
  id: number;
  botId?: number;
  status: "PENDING" | "PROCESSING" | "COMPLETE";
  type: "Normal" | "VIP";
};

type Bot = {
  id: number;
  status: "BUSY" | "IDLE";
  orderId?: number;
  timeLeftToCompleteOrder?: number;
};

const App = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextOrderId, setNextOrderId] = useState<number>(1001);

  const addOrder = (type: Order["type"]) => {
    const newOrder: Order = { id: nextOrderId, status: "PENDING", type };
    setNextOrderId(nextOrderId + 1);
    setOrders((currentOrders) => [...currentOrders, newOrder]);
    handleOrders();
  };

  const [bots, setBots] = useState<Bot[]>([]);
  const [nextBotId, setNextBotId] = useState<number>(1);

  const addBot = () => {
    const newBot: Bot = { id: nextBotId, status: "IDLE" };
    setNextBotId(nextBotId + 1);
    setBots((currentBots) => [...currentBots, newBot]);
    handleOrders();
  };

  const removeBot = () => {
    setBots((currentBots) => {
      const botToRemove = currentBots[currentBots.length - 1];
      if (typeof botToRemove !== "undefined") {
        setOrders(
          orders.map((order) => {
            return order.id === botToRemove.orderId
              ? { ...order, status: "PENDING" }
              : order;
          }),
        );
      }
      return currentBots.filter((_, idx, arr) => idx !== arr.length - 1);
    });
  };

  const handleOrders = () => {
    console.log(orders);
    setBots((prevBots) =>
      prevBots.map((bot) => {
        if (bot.status === "IDLE") {
          const isPendingVIPOrder = (order: Order) =>
            order.status === "PENDING" && order.type === "VIP";
          const isPendingNormalOrder = (order: Order) =>
            order.status === "PENDING" && order.type === "Normal";

          const orderToProcess =
            typeof orders.find(isPendingVIPOrder) !== "undefined"
              ? orders.find(isPendingVIPOrder)
              : orders.find(isPendingNormalOrder);

          if (typeof orderToProcess !== "undefined") {
            setOrders(
              orders.map((order) => {
                if (order.id === orderToProcess.id) {
                  return { ...order, status: "PROCESSING" };
                }
                return order;
              }),
            );
            return {
              ...bot,
              status: "BUSY",
              orderId: orderToProcess.id,
              timeLeftToCompleteOrder: 10,
            };
          }
        }
        return bot;
      }),
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBots(
        bots
          .map((bot) => ({
            ...bot,
            timeLeftToCompleteOrder:
              typeof bot.timeLeftToCompleteOrder !== "undefined"
                ? bot.timeLeftToCompleteOrder - 1
                : undefined,
          }))
          .map((bot) => {
            if (bot.timeLeftToCompleteOrder === 0) {
              setOrders(
                orders.map((order) => {
                  return order.id === bot.orderId
                    ? { ...order, status: "COMPLETE" }
                    : order;
                }),
              );
              return {
                ...bot,
                status: "IDLE",
                orderId: undefined,
                timeLeftToCompleteOrder: undefined,
              };
            }
            return bot;
          }),
      );
    }, 1000);

    return () => clearInterval(interval);
  });

  const getOrderBot = (orderId: number): Bot | undefined =>
    bots.find((bot) => bot.orderId === orderId);

  return (
    <>
      <h2>Pending Orders</h2>
      {orders
        .filter((order) => ["PENDING", "PROCESSING"].includes(order.status))
        .map((order) => (
          <div>
            {"Order " + order.id} {order.type === "VIP" && "(VIP)"}{" "}
            {getOrderBot(order.id) &&
              `(Bot ${getOrderBot(order.id)?.id}) (Finishing in ${
                getOrderBot(order.id)?.timeLeftToCompleteOrder
              })`}
          </div>
        ))}

      <h2>Complete Orders</h2>
      {orders
        .filter((order) => order.status === "COMPLETE")
        .map((order) => (
          <div>
            {"Order " + order.id} {order.type === "VIP" && "(VIP)"}{" "}
            {getOrderBot(order.id) &&
              `(Bot ${getOrderBot(order.id)?.id}) (Finishing in ${
                getOrderBot(order.id)?.timeLeftToCompleteOrder
              })`}
          </div>
        ))}

      <div>
        <button onClick={() => addOrder("Normal")}>Add Normal Order</button>
        <button onClick={() => addOrder("VIP")}>- Add VIP Order</button>
      </div>

      <hr />

      <h2>Idle Bots</h2>
      {bots
        .filter((bot) => bot.status === "IDLE")
        .map((bot) => (
          <div>{"Bot " + bot.id}</div>
        ))}

      <div>
        <button onClick={addBot}>+ Bot</button>
        <button onClick={removeBot}>- Bot</button>
      </div>
    </>
  );
};

export default App;
