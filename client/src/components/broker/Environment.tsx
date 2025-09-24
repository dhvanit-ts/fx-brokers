import React, { useState } from "react";
import Section from "./Section";
import { FiTrendingUp } from "react-icons/fi";
import { Environment as IEnvironment, Stats } from "@/types/brokers";
import { cn } from "@/lib/utils";
import { ChartAreaShadCN } from "../charts/area-chart";

function Environment({ environment }: { environment: IEnvironment }) {
  type Tab = (typeof environment.tabs)[number];
  const [tab, setTab] = useState<Tab>(environment.tabs[0]);

  const labels = environment.charts?.[tab].labels;
  const start = (labels?.length || 0) > 150 ? (labels?.length || 150) - 100 : 0;

  return (
    <Section title="Trading Environment" icon={<FiTrendingUp />}>
      <div className="flex gap-2">
        {environment.tabs.map((t) => {
          return (
            <button
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded",
                { "bg-gray-200": t === tab }
              )}
              key={t}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
         {environment.charts && (
              <div className="bg-white p-5 rounded-lg shadow md:col-span-2">
                <ChartAreaShadCN
                  xKey="x"
                  colors={{
                    AvaTrade: "#ff5e00",
                    Industry: "#023fa1"
                  }}
                  start={environment.charts[tab].labels[start]}
                  data={transformShadCNToGeneric(environment.charts[tab])}
                />
              </div>
            )}
        {environment.tabs[0] === tab && (
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                Performance Metrics
              </h3>
              <ul className="space-y-2 text-sm">
                {environment.speed.map((s, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{s.label}</span>
                    <span className="font-semibold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
        )}
        {environment.tabs[1] === tab && (
          <Mapper stats={environment.cost} heading="Cost" />
        )}
        {environment.tabs[2] === tab && (
          <Mapper stats={environment.offline} heading="Offline" />
        )}
        {environment.tabs[3] === tab && (
          <Mapper stats={environment.overnight} heading="Overnight" />
        )}
        {environment.tabs[4] === tab && (
          <Mapper stats={environment.slippage} heading="Slippage" />
        )}
        {environment.tabs[5] === tab && (
          <div>
            {environment.ranking?.map((r, idx) => (
              <button key={idx}>{r}</button>
            ))}
          </div>
        )}
        {environment.tabs[6] === tab && (
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
        )}
      </div>
    </Section>
  );
}

const Mapper = ({ stats, heading }: { stats: Stats[]; heading: string }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{heading}</h3>
      <ul className="space-y-2 text-sm">
        {stats.map((s, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{s.label}</span>
            <span className="font-semibold">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function transformShadCNToGeneric(oldData: {
  labels: (string | number)[];
  datasets: { name: string; data: unknown[] }[];
}) {
  const { labels, datasets } = oldData;
  const maxLength = Math.max(
    labels.length,
    ...datasets.map((d) => d.data.length)
  );

  return Array.from({ length: maxLength }, (_, i) => {
    const row: Record<string, unknown> = { x: labels[i] ?? i };
    datasets.forEach((d) => {
      row[d.name] = d.data[i] ?? null;
    });
    return row;
  });
}

export default Environment;
