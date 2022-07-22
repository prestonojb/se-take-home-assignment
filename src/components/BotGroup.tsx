import { Bot } from "../constants/types";

type Props = {
  status: Bot["status"];
  bots: Bot[];
};

const BotGroup = ({ status, bots }: Props) => {
  return (
    <>
      <h2>{status} Bots</h2>
      <div className="p-4 bg-light">
        {bots
          .filter((bot) => bot.status === status)
          .map((bot, idx) => (
            <div key={idx}>{"Bot " + bot.id}</div>
          ))}
      </div>
    </>
  );
};

export default BotGroup;
