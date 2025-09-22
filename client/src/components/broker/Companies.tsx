import React from "react";
import Section from "./Section";
import { FiBookOpen } from "react-icons/fi";
import Image from "next/image";
import { CompanyEntry } from "@/types/brokers";

function Companies({ companies }: { companies: CompanyEntry[] }) {
  return (
    <Section title="Companies" icon={<FiBookOpen />}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c, idx) => (
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
  );
}

export default Companies;
