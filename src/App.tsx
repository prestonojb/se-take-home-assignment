import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import OrderLine from "./components/OrderLine";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";

import { Bot, Order } from "./constants/types";
import { TIME_TO_PROCESS_ORDER } from "./constants/values";

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
    const newBot: Bot = { id: nextBotId, status: "AVAILABLE" };
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
    const idleBots = bots.filter((bot) => bot.status === "AVAILABLE");
    if (idleBots.length === 0) return;

    const unprocessedOrders = orders
      .filter(
        (order) =>
          order.status === "PENDING" &&
          !bots.map((bot) => bot.orderId).includes(order.id),
      )
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.id - b.id;
        }
        return a.type === "VIP" ? -1 : 1;
      });
    if (unprocessedOrders.length === 0) return;

    const botsCopy = [...bots];

    for (let unprocessedOrder of unprocessedOrders) {
      for (let bot of botsCopy) {
        if (bot.status === "AVAILABLE") {
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
                      status: "AVAILABLE",
                      orderId: undefined,
                      processOrder: undefined,
                    }
                  : prevBot;
              }),
            );
          }, TIME_TO_PROCESS_ORDER);
          break;
        }
      }
    }
    setBots(botsCopy);
  }, [orders, bots]);

  return (
    <Container fluid className="p-5">
      <Row>
        <Col className="mb-2">
          <h2>Pending Orders</h2>
          <div className="p-4 bg-light">
            {orders
              .filter((order) => order.status === "PENDING")
              .map((order, idx) => (
                <OrderLine
                  idx={idx}
                  order={order}
                  bot={getOrderBot(order.id)}
                />
              ))}
          </div>
        </Col>

        <Col className="mb-2">
          <h2>Complete Orders</h2>
          <div className="p-4 bg-light">
            {orders
              .filter((order) => order.status === "COMPLETE")
              .map((order, idx) => (
                <OrderLine
                  idx={idx}
                  order={order}
                  bot={getOrderBot(order.id)}
                />
              ))}
          </div>
        </Col>
      </Row>

      <Stack direction="horizontal" gap={2}>
        <Button variant="primary" onClick={() => addOrder("Normal")}>
          Add Normal Order
        </Button>
        <Button variant="secondary" onClick={() => addOrder("VIP")}>
          Add VIP Order
        </Button>
      </Stack>

      <hr />

      <Row className="mb-3">
        <Col>
          <h2>Idle Bots</h2>
          <div className="p-4 bg-light">
            {bots
              .filter((bot) => bot.status === "AVAILABLE")
              .map((bot, idx) => (
                <div key={idx}>{"Bot " + bot.id}</div>
              ))}
          </div>
        </Col>
      </Row>

      <Stack direction="horizontal" gap={2}>
        <Button className="me-1" variant="primary" onClick={addBot}>
          + Bot
        </Button>
        <Button variant="secondary" onClick={removeBot}>
          - Bot
        </Button>
      </Stack>
    </Container>
  );
};

export default App;
