import React from "react";
import Section from "./Section";
import { CloneFirm } from "@/types/brokers";
import { FiShield } from "react-icons/fi";
import Image from "next/image";
import fallbackImage from "@/constants/fallbackImage";

function Clones({clones}:{clones: CloneFirm[]}) {
  return (
    <Section title="Clone Firms (Warning)" icon={<FiShield />}>
      <div className="grid md:grid-cols-2 gap-4">
        {clones.map((clone, idx) => (
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
    </Section>
  );
}

export default Clones;
