import React from "react";
import Section from "./Section";
import Image from "next/image";
import fallbackImage from "@/constants/fallbackImage";
import { LicenseInfo } from "@/types/brokers";
import { FiShield } from "react-icons/fi";

function Licenses({licenses}: {licenses: LicenseInfo[]}) {
  return (
    <Section title="Licenses & Regulation" icon={<FiShield />}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {licenses.map((l, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow border flex items-center gap-4 hover:shadow-md transition"
          >
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
        ))}
      </div>
    </Section>
  );
}

export default Licenses;
