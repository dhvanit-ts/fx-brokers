import React from "react";
import { ChartRadar } from "../charts/radar-chart";
import { FiActivity } from "react-icons/fi";
import Section from "./Section";
import { environmentDetails } from "@/types/brokers";

function Environment({
  environmentDetails,
}: {
  environmentDetails: environmentDetails;
}) {
  return (
    <Section title="Environment Details" icon={<FiActivity />}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4 md:w-1/3">
          <div className="bg-green-50 p-4 rounded-xl shadow flex flex-col flex-grow items-center">
            <span className="text-gray-500 text-sm">Grade</span>
            <span className="text-2xl font-bold">
              {environmentDetails.grade}
            </span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow flex flex-col flex-grow items-center">
            <span className="text-gray-500 text-sm">Influence Score</span>
            <span className="text-2xl font-bold">
              {environmentDetails.influenceScore}
            </span>
            <span className="text-gray-400 text-xs">
              {environmentDetails.influenceCountry}
            </span>
          </div>
          <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col flex-grow items-center">
            <span className="text-gray-500 text-sm">Transaction Speed</span>
            <span className="text-2xl font-bold">
              {environmentDetails.avgTransactionSpeed}
            </span>
            <span className="text-gray-400 text-xs">ms</span>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:w-2/3">
          <div className="flex flex-col">
            <p className="text-zinc-600 text-xs mb-0.5">Capital</p>
            <p className="font-semibold">{environmentDetails.capital}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-600 text-xs mb-0.5">MT4 Server</p>
            <p className="font-semibold">{environmentDetails.mt4Server}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-600 text-xs mb-0.5">MT4 License</p>
            <p className="font-semibold">{environmentDetails.mt4License}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-600 text-xs mb-0.5">Speed Label</p>
            <p className="font-semibold">{environmentDetails.speedLabel}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-600 text-xs mb-0.5">Influence Grade</p>
            <p className="font-semibold">{environmentDetails.influenceGrade}</p>
          </div>
        </div>
      </div>

      {/* Optional Radar / Graph */}
      <div className="mt-6">
        <ChartRadar data={environmentDetails} />
      </div>
    </Section>
  );
}

export default Environment;
