import React from "react";
import Section from "./Section";
import { FiServer } from "react-icons/fi";
import { MtServer } from "@/types/brokers";

function MtInfoCards({ mtServers }: { mtServers: MtServer }) {
  return (
    <Section title="MT Servers" icon={<FiServer />}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mtServers.servers.map((card, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition"
          >
            <p className="font-semibold">{card.platform}</p>
            <p className="text-sm text-gray-500">{card.brokerName}</p>
            <p className="text-sm">Country: {card.country}</p>
            <p className="text-sm">Ping: {card.ping}</p>
            <p className="text-sm">Leverage: {card.leverage}</p>
            <p className="text-sm">Company: {card.platform}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default MtInfoCards;
