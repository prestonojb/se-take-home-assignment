import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { orderSort } from "./utils";

import BotGroup from "./components/BotGroup";
import BotButtonGroup from "./components/BotButtonGroup";
import OrderButtonGroup from "./components/OrderButtonGroup";
import OrderGroup from "./components/OrderGroup";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    setNextOrderId((prevOrderId) => prevOrderId + 1);
    setOrders((currentOrders) => [...currentOrders, newOrder]);
  };

  const addBot = () => {
    const newBot: Bot = { id: nextBotId, status: "AVAILABLE" };
    setNextBotId((prevOrderId) => prevOrderId + 1);
    setBots((currentBots) => [...currentBots, newBot]);
  };

  const removeBot = () => {
    setBots((currentBots) => {
      return currentBots.filter((_, idx, arr) => idx !== arr.length - 1);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBots((prevBots) =>
        prevBots.map((b) =>
          b.msLeft !== undefined
            ? {
                ...b,
                msLeft: b.msLeft - 1000,
              }
            : b,
        ),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    for (let bot of bots) {
      if (bot.msLeft !== undefined && bot.msLeft <= 0) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === bot.orderId ? { ...order, status: "COMPLETE" } : order,
          ),
        );
        setBots((prevBots) =>
          prevBots.map((prevBot) =>
            prevBot.id === bot.id
              ? {
                  ...prevBot,
                  status: "AVAILABLE",
                  orderId: undefined,
                  msLeft: undefined,
                }
              : prevBot,
          ),
        );
      }
    }
  }, [bots]);

  useEffect(() => {
    const availableBots = bots.filter((bot) => bot.status === "AVAILABLE");
    if (availableBots.length === 0) return;

    const unprocessedOrders = orders
      .filter(
        (order) =>
          order.status === "PENDING" &&
          !bots.map((bot) => bot.orderId).includes(order.id),
      )
      .sort(orderSort);
    if (unprocessedOrders.length === 0) return;

    const botsCopy = [...bots];

    for (let unprocessedOrder of unprocessedOrders) {
      for (let bot of botsCopy) {
        if (bot.status === "AVAILABLE") {
          bot.status = "BUSY";
          bot.orderId = unprocessedOrder.id;
          bot.msLeft = TIME_TO_PROCESS_ORDER;
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
          <OrderGroup
            orders={orders}
            orderSort={orderSort}
            status="PENDING"
            getOrderBot={getOrderBot}
          />
        </Col>

        <Col className="mb-2">
          <OrderGroup
            orders={orders}
            status="COMPLETE"
            getOrderBot={getOrderBot}
          />
        </Col>
      </Row>

      <OrderButtonGroup addOrder={addOrder} />

      <hr />

      <Row className="mb-3">
        <Col>
          <BotGroup status="AVAILABLE" bots={bots} />
        </Col>
      </Row>

      <BotButtonGroup addBot={addBot} removeBot={removeBot} />
    </Container>
  );
};

export default App;
