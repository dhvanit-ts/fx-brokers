import React from "react";
import Section from "./Section";
import { FiActivity } from "react-icons/fi";
import { environmentDetails } from "@/types/brokers";

function EnvironmentDetails({environmentDetails}:{environmentDetails: environmentDetails}) {
  return (
    <Section title="Environment Details" icon={<FiActivity />}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Performance Grade</h3>
          <p className="text-2xl font-bold text-blue-600">
            {environmentDetails.grade}
          </p>
          <p className="text-sm text-gray-500">
            Avg Speed: {environmentDetails.avgTransactionSpeed}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Platform Details</h3>
          <p>MT4 License: {environmentDetails.mt4License}</p>
          <p>Server: {environmentDetails.mt4Server}</p>
        </div>
      </div>
    </Section>
  );
}

export default EnvironmentDetails;
