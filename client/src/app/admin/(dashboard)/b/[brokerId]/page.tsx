"use client";

import React, { useState } from "react";
import { Broker } from "@/types/brokers";
import { useParams } from "next/navigation";
import brokersData from "@/data/brokers.json";
import {
  FiGlobe,
  FiPhone,
  FiBookOpen,
  FiDollarSign,
  FiShield,
  FiTrendingUp,
  FiLayers,
  FiServer,
} from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

// Collapsible Section Component
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
      {/* Section Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-lg font-semibold bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
      >
        <span className="text-blue-600 text-xl">{icon}</span>
        <span>{title}</span>
        <span className="ml-auto text-gray-500 font-bold text-xl">
          {open ? "−" : "+"}
        </span>
      </button>

      {/* Section Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const BrokerPage = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const broker: Broker | null = (brokersData.find((b) => b.name === brokerId) ??
    null) as Broker | null;

  if (!broker) {
    return (
      <div className="p-6 text-center text-gray-600">⚠️ Broker not found.</div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <Image
          src={broker.image}
          alt={broker.name}
          width={96}
          height={96}
          className="w-24 h-24 rounded-xl border shadow-sm object-contain bg-gray-50"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{broker.name}</h1>
          <a
            href={broker.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline justify-center md:justify-start mt-1"
          >
            <FiGlobe /> Visit Website
          </a>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-lg">⭐</span>{" "}
            <span className="font-semibold text-lg text-yellow-600">
              {broker.score}
            </span>{" "}
            · {broker.country.years} experience
          </p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
            {broker.labels.map((label, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 
                           text-xs px-3 py-1 rounded-full shadow-sm font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      {broker.basicInfo && (
        <Section title="Basic Info" icon={<FiBookOpen />}>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Company:</strong> {broker.basicInfo.companyName}
            </p>
            <p>
              <strong>Region:</strong> {broker.basicInfo.registeredRegion}
            </p>
            <p>
              <strong>Operating Period:</strong>{" "}
              {broker.basicInfo.operatingPeriod}
            </p>
            <p>
              <FiPhone className="inline mr-1 text-gray-500" />{" "}
              {broker.basicInfo.contactNumber || "N/A"}
            </p>
            <p>
              <FiGlobe className="inline mr-1 text-gray-500" />{" "}
              {broker.basicInfo.companyWebsite || "N/A"}
            </p>
            <p>
              <FaFacebook className="inline mr-1 text-blue-600" />{" "}
              {broker.basicInfo.Facebook || "N/A"}
            </p>
          </div>
        </Section>
      )}

      {/* Licenses */}
      {broker.licenses && (
        <Section title="Licenses & Regulation" icon={<FiShield />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.licenses.map((l, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow border flex items-center gap-4 hover:shadow-md transition"
              >
                <Image
                  height={32}
                  width={32}
                  src={l.flag}
                  alt={l.country}
                  className="w-8 h-8 rounded-full border"
                />
                <div>
                  <p className="font-semibold">{l.regulator}</p>
                  <p className="text-sm text-gray-500">
                    {l.country} · {l.licenseType}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      l.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Markets */}
      {broker.markets && broker.markets.length > 0 && (
        <Section title="Markets" icon={<FiLayers />}>
          <div className="flex flex-wrap gap-3">
            {broker.markets.map((m, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg shadow-sm text-sm font-medium"
              >
                {m.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* MT Info */}
      {broker.mtInfo && (
        <Section title="MT Info" icon={<FiGlobe />}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 bg-gray-100 rounded">
                MT4 Servers: {broker.mtInfo.mt4Servers || "N/A"}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded">
                MT5 Servers: {broker.mtInfo.mt5Servers || "N/A"}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded">
                Avg Execution Speed: {broker.mtInfo.avgExecutionSpeed || "N/A"}{" "}
                ms
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {broker.mtInfo.platforms.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow bg-white flex items-center gap-3"
                >
                  {p.logo && (
                    <Image
                      width={32}
                      height={32}
                      src={p.logo}
                      alt={p.name || "Platform"}
                      className="w-8 h-8"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-500">
                      Rating: {p.rating || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* MT Info Cards */}
      {broker.mtInfoCards && (
        <Section title="MT Servers" icon={<FiServer />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.mtInfoCards.map((card, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition"
              >
                <p className="font-semibold">{card.platform}</p>
                <p className="text-sm text-gray-500">{card.serverName}</p>
                <p className="text-sm">Country: {card.country}</p>
                <p className="text-sm">Ping: {card.ping}</p>
                <p className="text-sm">Leverage: {card.leverageList}</p>
                <p className="text-sm">Company: {card.company}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Spreads */}
      {broker.spreads && (
        <Section title="Spreads" icon={<FiDollarSign />}>
          <div className="overflow-x-auto border rounded-lg shadow">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  {[
                    "Trading Pair",
                    "Buy",
                    "Account",
                    "Spread",
                    "Avg Spread Day",
                    "Long Swap",
                    "Short Swap",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border p-3 text-left font-semibold text-gray-700"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {broker.spreads.map((s, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 transition-colors odd:bg-white even:bg-gray-50"
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
        </Section>
      )}

      {/* Environment */}
      {broker.environment && (
        <Section title="Trading Environment" icon={<FiTrendingUp />}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                Performance Metrics
              </h3>
              <ul className="space-y-2 text-sm">
                {broker.environment.speed.map((s, idx) => (
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
                  Ranking: {broker.environment.summary.ranking}
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  Orders: {broker.environment.summary.orders}
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  Margin: {broker.environment.summary.margin}
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  Users: {broker.environment.summary.testUsers}
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Business Area */}
      {broker.bizArea && (
        <Section title="Business Areas" icon={<FiGlobe />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.bizArea.map((area, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow flex items-center gap-3"
              >
                <Image
                  width={24}
                  height={24}
                  src={area.flag}
                  alt={area.country}
                  className="w-6 h-6 rounded-full"
                />
                <span>
                  {area.country} - <strong>{area.value}%</strong>
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Clones */}
      {broker.clones && (
        <Section title="Clone Firms (Warning)" icon={<FiShield />}>
          <div className="grid md:grid-cols-2 gap-4">
            {broker.clones.map((clone, idx) => (
              <div
                key={idx}
                className="p-4 bg-red-50 flex space-x-4 border border-red-200 rounded-lg shadow"
              >
                <Image
                  height={64}
                  width={64}
                  src={clone.logo}
                  alt={clone.name}
                  className="h-16 mb-2"
                />
                <div>
                  <p className="font-semibold text-red-700">{clone.name}</p>
                  <p className="text-sm text-gray-600">Score: {clone.score}</p>
                  <a
                    href={clone.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 text-sm hover:underline"
                  >
                    View More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Companies */}
      {broker.companies && (
        <Section title="Companies" icon={<FiBookOpen />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.companies.map((c, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition"
              >
                <Image
                  width={48}
                  height={48}
                  src={c.logoUrl}
                  alt={c.companyName}
                  className="w-12 h-12 mb-2"
                />
                <p className="font-semibold">{c.companyName}</p>
                <p className="text-sm text-gray-500">{c.country}</p>
                <p className="text-xs text-gray-400">
                  Status: {c.status} · Reg#: {c.registrationNo}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default BrokerPage;
