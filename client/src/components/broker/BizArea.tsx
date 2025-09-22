import React from "react";
import Section from "./Section";
import { BizAreaEntry } from "@/types/brokers";
import { FiGlobe } from "react-icons/fi";
import Image from "next/image";
import fallbackImage from "@/constants/fallbackImage";

function BizArea({bizArea}:{bizArea: BizAreaEntry[]}) {
  return (
    <Section title="Business Areas" icon={<FiGlobe />}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bizArea.map((area) =>
          area.ranking.map((r, idx) => (
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
          ))
        )}
      </div>
    </Section>
  );
}

export default BizArea;
