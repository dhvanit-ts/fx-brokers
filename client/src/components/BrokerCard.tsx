import { FaStar } from "react-icons/fa";
import type { Broker } from "../types/brokers";
import Link from "next/link";
import Image from "next/image";

function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <Link
      href={`/brokers/${broker.name}`}
      className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-xl border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-300 cursor-pointer"
    >
      {/* Broker Image */}
      <div className="relative flex-shrink-0 m-4">
        <Image
          height={60}
          width={80}
          src={broker.image}
          alt={broker.name}
          className="h-20 w-auto rounded-lg border border-gray-300"
        />
        {broker.tag && (
          <span className="absolute top-0 left-0 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-tr-lg rounded-bl-lg shadow">
            {broker.tag}
          </span>
        )}
      </div>

      {/* Broker Details */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {broker.name}
          </h2>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-700 border border-gray-300">
            <span>{broker.score}</span>
            <FaStar className="text-yellow-400" size={16} />
          </div>
        </div>

        {/* Country & License */}
        <p className="text-sm text-gray-500 mt-1">
          {broker.country.years} | {broker.license}
        </p>

        {/* Licenses */}
        <div className="mt-2 space-y-1">
          {broker.licenses?.map((license, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
              {license.flag && (
                <Image
                  height={16}
                  width={16}
                  src={license.flag}
                  alt={license.country || "flag"}
                  className="h-4 w-4 object-cover rounded-sm"
                />
              )}
              <p className="flex flex-wrap items-center gap-1">
                <span>
                  {license.regulator}
                  {license.country && ` - ${license.country}`}
                  {license.licenseType && ` - ${license.licenseType}`}
                </span>
                {license.status && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-medium">
                    {license.status}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="mt-3 flex flex-wrap gap-2">
          {broker.labels.map((label, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full border border-gray-200"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default BrokerCard;
