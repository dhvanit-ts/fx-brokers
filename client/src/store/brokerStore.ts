import { Broker } from "@/types/brokers";
import { create } from "zustand";

interface BrokerState {
  brokers: Broker[];
  addBroker: (broker: Broker) => void;
  setBrokers: (brokers: Broker[]) => void;
  removeBroker: (id: string) => void;
  updateBroker: (id: string, broker: Broker) => void;
}

const useBrokerStore = create<BrokerState>((set) => ({
  brokers: [],
  addBroker: (broker: Broker) =>
    set((state) => ({ brokers: [...state.brokers, broker] })),
  setBrokers: (brokers: Broker[]) => set({ brokers }),
  removeBroker: (id: string) =>
    set((state) => ({
      brokers: state.brokers.filter((broker) => broker._id !== id),
    })),
  updateBroker: (id: string, broker: Broker) =>
    set((state) => ({
      brokers: state.brokers.map((b) => (b._id === id ? broker : b)),
    })),
}));

export default useBrokerStore;
