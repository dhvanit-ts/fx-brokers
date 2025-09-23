"use client";

import React, { useEffect, useState } from "react";
import { Broker } from "@/types/brokers";
import { useParams } from "next/navigation";
import fetcher from "@/utils/fetcher";
import About from "@/components/broker/About";
import Header from "@/components/broker/Header";
import EnvironmentInfo from "@/components/broker/EnvironmentInfo";
import BasicInfo from "@/components/broker/BasicInfo";
import Licenses from "@/components/broker/Licenses";
import Markets from "@/components/broker/Markets";
import EnvironmentDetails from "@/components/broker/EnvironmentDetails";
import MetaServers from "@/components/broker/MetaServers";
import Spreads from "@/components/broker/Spreads";
import Environment from "@/components/broker/Environment";
import BizArea from "@/components/broker/BizArea";
import Clones from "@/components/broker/Clones";
import Companies from "@/components/broker/Companies";
import AdditionalInfo from "@/components/broker/AdditionalInfo";

const BrokerPage = () => {
  const [broker, setBroker] = useState<Broker | null>(null);
  const { brokerId } = useParams<{ brokerId: string }>();
  // Add these at the beginning of the component
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update the useEffect
  useEffect(() => {
    (async () => {
      if (!brokerId) return;

      try {
        setIsLoading(true);
        const data = await fetcher.get<{ data: Broker }>({
          endpointPath: `/brokers/get/one/${brokerId}`,
          statusShouldBe: 200,
          onError: (err?: Error) =>
            setError(err?.message || "Failed to load broker data"),
        });
        if (data) setBroker(data.data);
      } catch {
        setError("Failed to load broker data");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [brokerId]);

  // Add loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading broker details...</p>
        </div>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="p-6 text-center text-gray-600">⚠️ Broker not found.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <Header broker={broker} />

      {/* Basic Info */}
      {broker && <BasicInfo broker={broker} />}

      {broker.environmentDetails && (
        <EnvironmentInfo environmentDetails={broker.environmentDetails} />
      )}

      {/* Licenses */}
      {broker.licenses && <Licenses licenses={broker.licenses} />}

      {/* Markets */}
      {broker.markets && broker.markets.length > 0 && (
        <Markets markets={broker.markets} />
      )}

      {broker.about && <About about={broker.about} />}

      {broker.environmentDetails && <EnvironmentDetails environmentDetails={broker.environmentDetails} />}

      {/* MT Info */}
      {broker.meta_trader && <MetaServers mtServers={broker.meta_trader} />}

      {broker.spreads && <Spreads spreads={broker.spreads} />}

      {/* Environment */}
      {broker.environment && <Environment environment={broker.environment} />}

      {/* Business Area */}
      {broker.bizArea && <BizArea bizArea={broker.bizArea} />}

      {/* Clones */}
      {broker.clones && <Clones clones={broker.clones} />}

      {/* Companies */}
      {broker.companies && (
        <Companies companies={broker.companies} />
      )}

      <AdditionalInfo broker={broker} />
    </div>
  );
};

export default BrokerPage;
