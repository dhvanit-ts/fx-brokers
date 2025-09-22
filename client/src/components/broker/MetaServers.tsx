import { MtServer } from "@/types/brokers";
import React from "react";

function MetaServers({ mtServers }: { mtServers: MtServer }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="px-3 py-1 bg-gray-100 rounded">
          MT4 Servers:{" "}
          {mtServers.servers.map((s) => s.platform === "MT4").length || "N/A"}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded">
          MT5 Servers:{" "}
          {mtServers.servers.map((s) => s.platform === "MT5").length || "N/A"}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded">
          Avg Execution Speed: {mtServers.executionSpeed || "N/A"} ms
        </span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mtServers.servers.map((s, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg shadow bg-white flex items-center gap-3"
          >
            <div>
              <p className="font-semibold">{s.brokerName}</p>
              <p className="text-sm text-gray-500">
                Platform: {s.platform || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetaServers;
