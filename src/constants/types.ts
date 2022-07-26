export type Order = {
  id: number;
  botId?: number;
  status: "PENDING" | "COMPLETE";
  type: "Normal" | "VIP";
};

export type Bot = {
  id: number;
  status: "BUSY" | "AVAILABLE";
  orderId?: number;
  msLeft?: number;
};
