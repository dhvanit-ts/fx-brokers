import React from "react";
import Section from "./Section";
import { FiDollarSign } from "react-icons/fi";
import { SpreadInfo } from "@/types/brokers";

function Spreads({ spreads }: { spreads: SpreadInfo[] }) {
  return (
    <Section title="Spreads" icon={<FiDollarSign />}>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {[
                  "Trading Pair",
                  "Buy",
                  "Account",
                  "Spread",
                  "Avg Spread Day",
                  "Long Swap",
                  "Short Swap",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {spreads.map((s, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors text-sm"
                >
                  <td className="border p-3">{s.tradingPair}</td>
                  <td className="border p-3">{s.buy}</td>
                  <td className="border p-3">{s.account}</td>
                  <td className="border p-3">{s.spread}</td>
                  <td className="border p-3">{s.avgSpreadDay}</td>
                  <td className="border p-3">{s.longSwap}</td>
                  <td className="border p-3">{s.shortSwap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

export default Spreads;
