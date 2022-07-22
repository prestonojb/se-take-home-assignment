import { Order } from "./constants/types";

export const orderSort = (a: Order, b: Order) => {
  if (a.type === b.type) {
    return a.id - b.id;
  }
  return a.type === "VIP" ? -1 : 1;
};
