"use client";

import React, { useEffect, useState } from "react";
import {
  BizAreaEntry,
  Broker,
  LicenseInfo,
  Market,
  SpreadInfo,
} from "@/types/brokers";
import { useParams } from "next/navigation";
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
import { FaChartArea, FaFacebook, FaInfo } from "react-icons/fa";
import Image from "next/image";
import TagInputComponent from "@/components/ui/TagInput";
import InputBox from "@/components/InputBox";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { GrCertificate } from "react-icons/gr";
import { TbCube3dSphere } from "react-icons/tb";
import { HiCurrencyDollar, HiServer } from "react-icons/hi";
import { FaChartSimple, FaMapLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { BsBuildingsFill } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateLicense from "@/components/forms/CreateLicense";
import CreateMarket from "@/components/forms/CreateMarket";
import CreateSpread from "@/components/forms/CreateSpread";
import CreateBusinessArea from "@/components/forms/CreateBussinessArea";
import axios from "axios";
import fallbackImage from "@/constants/fallbackImage";

const tabs = [
  { icon: <FaInfo />, label: "Basic info" },
  { icon: <GrCertificate />, label: "Licenses and Regulations" },
  { icon: <FaChartSimple />, label: "Markets" },
  { icon: <TbCube3dSphere />, label: "MT Info" },
  { icon: <HiServer />, label: "MT Servers" },
  { icon: <HiCurrencyDollar />, label: "Spreads" },
  { icon: <FaChartArea />, label: "Trading Environment" },
  { icon: <FaMapLocationDot />, label: "Business Areas" },
  { icon: <IoIosWarning />, label: "Clone Firms (Warning)" },
  { icon: <BsBuildingsFill />, label: "Companies" },
];

const EditBrokerPage = () => {
  const [broker, setBroker] = useState<Broker | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { brokerId } = useParams<{ brokerId: string }>();

  useEffect(() => {
    (async () => {
      if (!brokerId) return;

      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/brokers/get/one/1`
        );
        setBroker(data.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [brokerId]);

  if (!broker) return <p>⚠️ Broker not found</p>;

  const onSubmit = (data: Broker) => {
    console.log("Updated broker:", data);
    setBroker(data);
  };

  return (
    <>
      <Tabs setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
      <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gray-50">
        {/* Header */}
        {activeIndex === 0 && (
          <>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <Image
                src={broker.image ?? fallbackImage}
                alt={broker.name || "Logo"}
                width={96}
                height={96}
                className="w-24 h-24 rounded-xl border shadow-sm object-contain bg-gray-50"
              />
              <div className="text-center md:text-left">
                <InputBox
                  className="text-3xl w-full font-bold text-gray-800"
                  value={broker.name || ""}
                  setValue={(v) => setBroker({ ...broker, name: v })}
                />
                <InputBox
                  value={broker.website || ""}
                  setValue={(v) => setBroker({ ...broker, website: v })}
                  className="flex items-center w-full gap-2 text-blue-600 hover:underline justify-center md:justify-start mt-1"
                />
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-lg">⭐</span>{" "}
                  <span className="font-semibold text-lg text-yellow-600">
                    {broker.score}
                  </span>{" "}
                  · {broker.years} experience
                </p>
                {/* <TagInputComponent
                  setTags={(labels) =>
                    setBroker((state) => ({
                      ...state,
                      labels: labels.map((l) => l.id),
                    }))
                  }
                  tags={broker.labels?.map((label) => ({
                    text: label,
                    id: label,
                  }))}
                /> */}
              </div>
            </div>

            {/* Basic Info */}
            {broker && (
              <BasicInfoSection broker={broker} setBroker={setBroker} />
            )}
          </>
        )}

        {/* Licenses */}
        {activeIndex === 1 && broker.licenses && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.licenses.map((l, idx) => (
              <CreateLicense
                key={idx}
                initialData={l}
                setFormValueOnSubmit={(v: LicenseInfo) => {
                  setBroker((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      licenses:
                        prev.licenses?.map((license) =>
                          license.id === v.id ? v : license
                        ) ?? [],
                    };
                  });
                }}
              >
                <div className="p-4 bg-white rounded-lg shadow border flex items-center gap-4 hover:shadow-md transition">
                  <Image
                    height={32}
                    width={32}
                    src={l.flag || fallbackImage}
                    alt={l.country || "Flag"}
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
              </CreateLicense>
            ))}
            <CreateLicense
              setFormValueOnSubmit={(v: LicenseInfo) => {
                setBroker((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    licenses:
                      prev.licenses?.map((license) =>
                        license.id === v.id ? v : license
                      ) ?? [],
                  };
                });
              }}
            >
              <div className="h-28 cursor-pointer w-full border bg-zinc-100 hover:bg-zinc-200/50 rounded-md shadow-md border-zinc-300 flex justify-center items-center">
                <FaPlus />
              </div>
            </CreateLicense>
          </div>
        )}

        {/* Markets */}
        {activeIndex === 2 && (
          <div className="flex flex-wrap gap-3">
            {broker.markets.map((m, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg shadow-sm text-sm font-medium"
              >
                {m.name}
              </span>
            ))}
            <CreateMarket
              setFormValueOnSubmit={(v: Market) => {
                setBroker((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    markets:
                      prev.markets?.map((market) =>
                        market.id === v.id ? v : market
                      ) ?? [],
                  };
                });
              }}
            >
              <div className="h-28 cursor-pointer w-full border bg-zinc-100 hover:bg-zinc-200/50 rounded-md shadow-md border-zinc-300 flex justify-center items-center">
                <FaPlus />
              </div>
            </CreateMarket>
          </div>
        )}

        {/* MT Info */}
        {broker.mtServers && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 bg-gray-100 rounded">
                MT4 Servers:{" "}
                {broker.mtServers.servers.map((s) => s.platform === "MT4")
                  .length || "N/A"}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded">
                MT5 Servers:{" "}
                {broker.mtServers.servers.map((s) => s.platform === "MT5")
                  .length || "N/A"}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded">
                Avg Execution Speed: {broker.mtServers.executionSpeed || "N/A"}{" "}
                ms
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {broker.mtServers.servers.map((s, idx) => (
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
        )}

        {/* MT Info Cards */}
        {activeIndex === 4 && broker.mtServers && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.mtServers.servers.map((card, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition"
              >
                <p className="font-semibold">{card.platform}</p>
                <p className="text-sm text-gray-500">{card.brokerName}</p>
                <p className="text-sm">Country: {card.country}</p>
                <p className="text-sm">Ping: {card.ping}</p>
                <p className="text-sm">Leverage: {card.leverage}</p>
                <p className="text-sm">Company: {card.platform}</p>
              </div>
            ))}
          </div>
        )}

        {/* Spreads */}
        {activeIndex === 5 && broker.spreads && (
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
                  <CreateSpread
                    key={idx}
                    initialData={s}
                    setFormValueOnSubmit={(v: SpreadInfo) => {
                      setBroker((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          spreads:
                            prev.spreads?.map((s) => (s.id === v.id ? v : s)) ??
                            [],
                        };
                      });
                    }}
                  >
                    <tr className="hover:bg-blue-50 transition-colors odd:bg-white even:bg-gray-50">
                      <td className="border p-3">{s.tradingPair}</td>
                      <td className="border p-3">{s.buy}</td>
                      <td className="border p-3">{s.account}</td>
                      <td className="border p-3">{s.spread}</td>
                      <td className="border p-3">{s.avgSpreadDay}</td>
                      <td className="border p-3">{s.longSwap}</td>
                      <td className="border p-3">{s.shortSwap}</td>
                    </tr>
                  </CreateSpread>
                ))}
              </tbody>
            </table>
            <CreateSpread
              setFormValueOnSubmit={(v: SpreadInfo) => {
                setBroker((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    spreads:
                      prev.spreads?.map((s) => (s.id === v.id ? v : s)) ?? [],
                  };
                });
              }}
            >
              <div className="w-full cursor-pointer h-10 border border-zinc-200 text-zinc-600 flex justify-center items-center">
                <FaPlus />
              </div>
            </CreateSpread>
          </div>
        )}

        {/* Environment */}
        {activeIndex === 6 && broker.environment && (
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
        )}

        {/* Business Area */}
        {activeIndex === 7 && broker.bizArea && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.bizArea.map((area, idx) => (
              <CreateBusinessArea
                key={idx}
                initialData={area}
                setFormValueOnSubmit={(v: BizAreaEntry) => {
                  setBroker((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      bizArea:
                        prev.bizArea?.map((s) => (s.id === v.id ? v : s)) ?? [],
                    };
                  });
                }}
              >
                {area.ranking.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg shadow flex items-center gap-3"
                  >
                    <Image
                      width={24}
                      height={24}
                      src={r.flag || fallbackImage}
                      alt={r.country || "Rankings"}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>
                      {r.country} - <strong>{r.value}%</strong>
                    </span>
                  </div>
                ))}
              </CreateBusinessArea>
            ))}
            <div className="flex justify-center items-center text-zinc-500">
              <FaPlus />
            </div>
          </div>
        )}

        {/* Clones */}
        {activeIndex === 8 && broker.clones && (
          <div className="grid md:grid-cols-2 gap-4">
            {broker.clones.map((clone, idx) => (
              <div
                key={idx}
                className="p-4 bg-red-50 flex space-x-4 border border-red-200 rounded-lg shadow"
              >
                <Image
                  height={64}
                  width={64}
                  src={clone.logo || fallbackImage}
                  alt={clone.name || "Clones"}
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
        )}

        {/* Companies */}
        {activeIndex === 9 && broker.companies && (
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
        )}
      </div>
    </>
  );
};

const Tabs = ({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(0, prev - 1)); // stop at first
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(tabs.length - 1, prev + 1)); // stop at last
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // cleanup to avoid memory leaks
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveIndex]);

  return (
    <div className="sticky top-0 shadow-lg bg-zinc-50 z-30">
      <div className="flex mx-auto w-fit space-x-[0.05rem]">
        {tabs.map((tab, idx) => (
          <Tooltip key={tab.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "text-lg cursor-pointer font-semibold border-b-4 transition-all border-zinc-50 p-4 text-center",
                  idx === activeIndex
                    ? "border-blue-500 border-b-4"
                    : "hover:text-zinc-900 hover:border-zinc-400 text-zinc-500"
                )}
              >
                {tab.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent>{tab.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

const BasicInfoSection = ({
  broker,
  setBroker,
}: {
  broker: Broker;
  setBroker: React.Dispatch<React.SetStateAction<Broker | null>>;
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
      <p className="flex space-x-2">
        <strong>Company:</strong>
        <InputBox
          type="text"
          value={broker?.name ?? ""}
          placeholder="Company"
          setValue={(v) =>
            setBroker({
              ...broker,
              name: v ?? "",
            })
          }
        />
      </p>
      <p className="flex space-x-2">
        <strong>Region:</strong>
        <InputBox
          placeholder="Region"
          value={broker.country ?? ""}
          setValue={(v) =>
            setBroker({
              ...broker,
              country: v,
            })
          }
        />
      </p>
      <p className="flex space-x-2">
        <strong>Operating Period:</strong>
        <InputBox
          value={broker.score ?? ""}
          placeholder="Operating period"
          setValue={(v) =>
            setBroker({
              ...broker,
              score: v,
            })
          }
        />
      </p>
      <p className="flex space-x-2">
        <FiPhone className="inline mr-1 text-gray-500" />{" "}
        <InputBox
          placeholder="Contact number"
          value={broker.contact?.[0] ?? ""}
          setValue={(v) => {
            setBroker({
              ...broker,
              contact: [...(broker.contact || []), v],
            });
          }}
        />
      </p>
      <p className="flex space-x-2">
        <FiGlobe className="inline mr-1 text-gray-500" />{" "}
        <InputBox
          value={broker.website ?? ""}
          placeholder="Website"
          setValue={(v) =>
            setBroker({
              ...broker,
              website: v,
            })
          }
        />
      </p>
    </div>
  );
};

export default EditBrokerPage;
