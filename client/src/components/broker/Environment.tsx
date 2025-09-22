import React from "react";
import Section from "./Section";
import { FiTrendingUp } from "react-icons/fi";
import { Environment as IEnvironment } from "@/types/brokers";

function Environment({environment}: {environment: IEnvironment}) {
  return (
    <Section title="Trading Environment" icon={<FiTrendingUp />}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
          <ul className="space-y-2 text-sm">
            {environment.speed.map((s, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{s.label}</span>
                <span className="font-semibold">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              Ranking: {environment.summary.ranking}
            </div>
            <div className="p-3 bg-gray-50 rounded">
              Orders: {environment.summary.orders}
            </div>
            <div className="p-3 bg-gray-50 rounded">
              Margin: {environment.summary.margin}
            </div>
            <div className="p-3 bg-gray-50 rounded">
              Users: {environment.summary.testUsers}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Environment;
