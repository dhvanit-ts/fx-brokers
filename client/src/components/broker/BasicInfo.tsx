import React from "react";
import Section from "./Section";
import { FiBookOpen, FiGlobe, FiPhone } from "react-icons/fi";
import { Broker } from "@/types/brokers";

function BasicInfo({ broker }: { broker: Broker }) {
  return (
    <Section title="Basic Info" icon={<FiBookOpen />}>
      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p>
          <strong>Company:</strong> {broker.name}
        </p>
        <p>
          <strong>Region:</strong> {broker.country}
        </p>
        <p>
          <FiPhone className="inline mr-1 text-gray-500" />{" "}
          {broker.contact?.[0] || "N/A"}
        </p>
        <p>
          <FiGlobe className="inline mr-1 text-gray-500" />{" "}
          {broker.website || "N/A"}
        </p>
      </div>
    </Section>
  );
}

export default BasicInfo;
