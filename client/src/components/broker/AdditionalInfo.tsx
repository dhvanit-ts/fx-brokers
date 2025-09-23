import React from "react";
import Section from "./Section";
import { FiMoreHorizontal } from "react-icons/fi";
import { Broker } from "@/types/brokers";

function AdditionalInfo({ broker }: { broker: Broker }) {
  return (
    <Section title="Additional Information" icon={<FiMoreHorizontal />}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ID and Tag */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">System Info</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">ID:</span>{" "}
              <span className="font-medium">{broker.id}</span>
            </p>
            {broker.tag && (
              <p className="text-sm">
                <span className="text-gray-500">Tag:</span>{" "}
                <span className="font-medium">{broker.tag}</span>
              </p>
            )}
          </div>
        </div>

        {/* Broker Licenses */}
        {broker.brokerLicenses && broker.brokerLicenses.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              License Details
            </h3>
            <div className="space-y-1">
              {broker.brokerLicenses.map((license, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  {license}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Data */}
        {broker.transactionData && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Transaction Overview
            </h3>
            <div className="space-y-2">
              {broker.transactionData.tabs.map((tab, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 bg-gray-50 rounded text-sm text-gray-600"
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Marketing Info */}
        {broker.marketing && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Marketing Data
            </h3>
            <div className="space-y-2">
              {broker.marketing.blocks.map((block, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-gray-700">
                    {block.title}
                  </p>
                  {block.items && (
                    <div className="mt-1 space-y-1">
                      {block.items.map((item, i) => (
                        <p key={i} className="text-xs text-gray-600">
                          {item.name}: {item.value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">
                Source: {broker.marketing.dataSource}
              </p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

export default AdditionalInfo;