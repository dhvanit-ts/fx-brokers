"use client";

import useBrokerStore from "@/store/brokerStore";
import { Broker } from "@/types/brokers";
import fetcher from "@/utils/fetcher";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

function DashboardPage() {
  const brokers = useBrokerStore((s) => s.brokers);
  const setBrokers = useBrokerStore((s) => s.setBrokers);

  const fetchBrokers = useCallback(async () => {
    const data = await fetcher.get<Broker[]>({
      endpointPath: "/brokers/get/all",
    });

    if (data) setBrokers(data);
  }, [setBrokers]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  return (
    <div>
      <div className="w-full h-12 bg-zinc-300 flex justify-between items-center px-4">
        <h1 className="text-center font-medium text-lg">Brokers</h1>
        <div>
          <Link href="/admin/brokers/create">
            <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white p-2 rounded">
              <FaPlus />
            </button>
          </Link>
        </div>
      </div>
      {brokers && brokers.length > 0 ? (
        brokers.map((broker) => (
          <div key={broker._id}>
            <h2>{broker.name}</h2>
            <p>{broker.website}</p>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-96">
          No Brokers found
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
