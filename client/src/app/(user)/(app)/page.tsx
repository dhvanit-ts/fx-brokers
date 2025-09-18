import BrokerCard from "@/components/BrokerCard";
import { Broker } from "@/types/brokers";
import brokerData from "@/data/brokers.json";

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {brokerData.map((broker: Broker) => (
        <BrokerCard key={broker.name} broker={broker} />
      ))}
    </div>
  );
}
