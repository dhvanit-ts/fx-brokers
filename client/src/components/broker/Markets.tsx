import React from "react";
import Section from "./Section";
import { FiLayers } from "react-icons/fi";

function Markets({ markets }: { markets: { name: string }[] }) {
  return (
    <Section title="Markets" icon={<FiLayers />}>
      <div className="flex flex-wrap gap-3">
        {markets.map((m, idx) => (
          <span
            key={idx}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg shadow-sm text-sm font-medium"
          >
            {m.name}
          </span>
        ))}
      </div>
    </Section>
  );
}

export default Markets;
