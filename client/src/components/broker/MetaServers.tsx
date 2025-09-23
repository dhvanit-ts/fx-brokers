"use client";

import { MtServer } from "@/types/brokers";
import React, { useMemo, useState } from "react";
import Section from "./Section";
import { FiServer } from "react-icons/fi";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function MetaServers({ mtServers }: { mtServers: MtServer }) {
  const [tab, setTab] = useState<"MT4" | "MT5" | "All">("MT4");

  return (
    <Section title="Meta Servers" icon={<FiServer />}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1 p-1 text-sm bg-zinc-100 w-fit border rounded-md">
          <span
            className={cn(
              "px-3 py-1 cursor-pointer rounded-md transition-all",
              tab === "All" ? "bg-zinc-200" : "hover:bg-zinc-200"
            )}
            onClick={() => setTab("All")}
          >
            All (
            {mtServers.servers.filter((s) => s.platform === "MT4").length ||
              "N/A"}
            )
          </span>
          <span
            className={cn(
              "px-3 py-1 cursor-pointer rounded-md transition-all",
              tab === "MT4" ? "bg-zinc-200" : "hover:bg-zinc-200"
            )}
            onClick={() => setTab("MT4")}
          >
            MT4 Servers (
            {mtServers.servers.filter((s) => s.platform === "MT4").length ||
              "N/A"}
            )
          </span>
          <span
            className={cn(
              "px-3 py-1 cursor-pointer rounded-md transition-all",
              tab === "MT5" ? "bg-zinc-200" : "hover:bg-zinc-200"
            )}
            onClick={() => setTab("MT5")}
          >
            MT5 Servers (
            {mtServers.servers.filter((s) => s.platform === "MT5").length ||
              "N/A"}
            )
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mtServers.servers
            .filter((c) => (tab === "All" ? true : c.platform === tab))
            .map((card, idx) => (
              <Dialog key={idx}>
                <DialogTrigger asChild>
                  <div
                    key={idx}
                    className="p-4 relative bg-white rounded-lg shadow border hover:shadow-md transition"
                  >
                    <p className="text-sm text-gray-500">{card.platform}</p>
                    <p className="font-semibold">{card.brokerName}</p>
                    <p className="text-sm">Country: {card.country}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm">Leverage: {card.leverage}</p>
                      </TooltipTrigger>
                      <TooltipContent className="h-80 overflow-y-auto">
                        <LeverageTable leverages={card.leverage.split(" | ")} />
                      </TooltipContent>
                    </Tooltip>
                    <span
                      className={`text-xs absolute top-4 right-4 px-2 py-1 rounded-md ${
                        Number(card.ping.split(" ")[0]) > 100
                          ? "bg-red-200"
                          : "bg-green-200"
                      }`}
                    >
                      {card.ping}
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{card.brokerName}</DialogTitle>
                    <DialogDescription>Server IPs</DialogDescription>
                  </DialogHeader>
                  <table className="min-w-full divide-y divide-zinc-200">
                    <tbody className="divide-y divide-zinc-200">
                      {card.serverIPs.map((ip, idx) => (
                        <tr key={idx} className="text-left">
                          <td className="py-2 px-4 text-sm">{ip.ip}</td>
                          <td className="py-2 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-md ${
                                Number(ip.ping.split(" ")[0]) > 100
                                  ? "bg-red-200"
                                  : "bg-green-200"
                              }`}
                            >
                              {ip.ping}
                            </span>
                          </td>
                          <td className="py-2 px-4 flex items-center gap-2">
                            <Image
                              src={ip.flag}
                              alt={ip.country}
                              width={24}
                              height={24}
                            />
                            <span className="text-sm">{ip.country}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DialogContent>
              </Dialog>
            ))}
        </div>
        <div className="flex space-x-2">
          <div className="gap-4 divide-y w-full divide-zinc-200">
            <h3 className="font-semibold py-2 px-2.5">Country</h3>
            {mtServers.countryRegion.map((card, idx) => (
              <div key={idx} className="p-4 flex justify-between">
                <div className="flex gap-2">
                  <Image
                    src={card.flag}
                    alt={card.secondValue}
                    width={24}
                    height={24}
                  />
                  <p className="text-sm">{card.country}</p>
                </div>
                <p className="text-sm">{card.firstValue}</p>
              </div>
            ))}
          </div>
          <div className="w-full space-y-2">
            <h3 className="font-semibold py-2 px-2.5">Licenses</h3>
            {mtServers.licenses.map((card, idx) => (
              <div
                key={idx}
                className="p-4 bg-green-200 rounded-md flex justify-between"
              >
                <p className="text-sm">{card}</p>
              </div>
            ))}
            <div className="p-4 grid grid-cols-2">
              <div className="px-3 py-1 flex flex-col space-y-1 bg-gray-100 rounded">
                <span className="text-xs text-zinc-600">
                  Avg Execution Speed
                </span>
                <span className="font-semibold text-lg">
                  {mtServers.executionSpeed || "N/A"} ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

const riskLevels = ["Extreme", "High", "Medium", "Low"];
const riskColors = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-300",
  "bg-green-400",
];

function getRiskIndex(leverage: number) {
  if (leverage >= 100) return 0; // Extreme
  if (leverage >= 50) return 1; // High
  if (leverage >= 20) return 2; // Medium
  return 3; // Low
}

function LeverageTable({ leverages = [] }: { leverages: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-800 rounded-lg overflow-hidden text-sm">
        <thead className="text-gray-300 text-left">
          <tr>
            <th className="px-4 py-2 border-b border-zinc-800">Leverage</th>
            <th className="px-4 py-2 border-b border-zinc-800">Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {leverages.map((lev, i) => {
            const riskIndex = getRiskIndex(Number(lev));
            return (
              <tr key={i}>
                <td className="px-4 py-3 font-medium text-gray-300 whitespace-nowrap">
                  1:{lev}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {/* risk bar with indicator */}
                    <div className="relative flex w-48 h-2 rounded-full overflow-hidden shadow-sm">
                      {/* risk bar segments */}
                      {riskLevels.map((_, j) => (
                        <div key={j} className={`flex-1 ${riskColors[j]}`} />
                      ))}

                      {/* indicator below the bar */}
                      <div
                        className="absolute top-0 w-0 h-0
               border-l-4 border-r-4 border-t-6
               border-transparent border-t-black
               transition-all"
                        style={{
                          // place arrow centered over segment
                          left: `${
                            (riskIndex + 0.5) * (100 / riskLevels.length)
                          }%`,
                          transform: "translateX(-50%)",
                        }}
                      />
                    </div>

                    {/* labels under the bar */}
                    <div className="flex justify-between text-xs text-gray-500 w-48">
                      {riskLevels.map((r, j) => (
                        <span key={j}>{r}</span>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MetaServers;
