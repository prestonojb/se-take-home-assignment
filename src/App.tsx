import React, { useState, useEffect, useRef } from "react";
import "./App.css";

type Order = {
  id: number;
  botId?: number;
  status: "PENDING" | "COMPLETE";
  type: "Normal" | "VIP";
};

type Bot = {
  id: number;
  status: "BUSY" | "IDLE";
  orderId?: number;
  processOrder?: ReturnType<typeof setTimeout>;
};

const App = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextOrderId, setNextOrderId] = useState<number>(1001);

  const [bots, setBots] = useState<Bot[]>([]);
  const [nextBotId, setNextBotId] = useState<number>(1);

  const getOrderBot = (orderId: number): Bot | undefined =>
    bots.find((bot) => bot.orderId === orderId);

  const addOrder = (type: Order["type"]) => {
    const newOrder: Order = { id: nextOrderId, status: "PENDING", type };
    setNextOrderId(nextOrderId + 1);
    setOrders((currentOrders) => [...currentOrders, newOrder]);
  };

  const addBot = () => {
    const newBot: Bot = { id: nextBotId, status: "IDLE" };
    setNextBotId(nextBotId + 1);
    setBots((currentBots) => [...currentBots, newBot]);
  };

  const removeBot = () => {
    setBots((currentBots) => {
      const botToRemove: Bot = currentBots[currentBots.length - 1];
      if (botToRemove !== undefined && botToRemove.processOrder !== undefined) {
        clearTimeout(botToRemove.processOrder);
      }
      return currentBots.filter((_, idx, arr) => idx !== arr.length - 1);
    });
  };

  useEffect(() => {
    const idleBots = bots.filter((bot) => bot.status === "IDLE");
    const unprocessedOrders = orders.filter(
      (order) =>
        order.status === "PENDING" &&
        !bots.map((bot) => bot.orderId).includes(order.id),
    );

    if (idleBots.length === 0) return;
    if (unprocessedOrders.length === 0) return;

    const botsCopy = [...bots];

    for (let unprocessedOrder of unprocessedOrders) {
      for (let bot of botsCopy) {
        if (bot.status === "IDLE") {
          bot.status = "BUSY";
          bot.orderId = unprocessedOrder.id;
          bot.processOrder = setTimeout(() => {
            setOrders((prevOrders) =>
              prevOrders.map((order) => {
                return order.id === unprocessedOrder.id
                  ? { ...order, status: "COMPLETE" }
                  : order;
              }),
            );
            setBots((prevBots) =>
              prevBots.map((prevBot) => {
                return prevBot.id === bot.id
                  ? {
                      ...prevBot,
                      status: "IDLE",
                      orderId: undefined,
                      processOrder: undefined,
                    }
                  : prevBot;
              }),
            );
          }, 1000);
          break;
        }
      }
    }
    setBots(botsCopy);
  }, [orders, bots]);

  return (
    <>
      <h2>Pending Orders</h2>
      {orders
        .filter((order) => order.status === "PENDING")
        .map((order) => (
          <div>
            {"Order " + order.id} {order.type === "VIP" && "(VIP)"}{" "}
            {getOrderBot(order.id) && `(Bot ${getOrderBot(order.id)?.id})`}
          </div>
        ))}

      <h2>Complete Orders</h2>
      {orders
        .filter((order) => order.status === "COMPLETE")
        .map((order) => (
          <div>
            {"Order " + order.id} {order.type === "VIP" && "(VIP)"}{" "}
            {getOrderBot(order.id) && `(Bot ${getOrderBot(order.id)?.id})`}
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
