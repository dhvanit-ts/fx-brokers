"use client"

import {
  FiClock,
  FiExternalLink,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiShield,
} from "react-icons/fi";
import fallbackImage from "@/constants/fallbackImage";
import { Broker } from "@/types/brokers";
import Image from "next/image";
import React from "react";
import { ChartRadar } from "../charts/radar-chart";

function Header({broker}: {broker: Broker}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row p-6 gap-8">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <div className="relative bg-white rounded-lg border border-gray-100 p-4 shadow-sm w-[160px] h-[160px]">
            <Image
              src={broker.image || fallbackImage}
              alt={broker.name || "Broker logo"}
              priority
              fill
              className="object-contain p-2"
            />
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-grow space-y-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {broker.name}
              </h1>
              {broker.score && (
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                  Score: {broker.score}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {broker.years && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <span>Operating since {broker.years}</span>
                </div>
              )}
              {broker.country && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span>{broker.country}</span>
                </div>
              )}
              {broker.license && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiShield className="w-4 h-4 text-gray-400" />
                  <span>{broker.license}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {broker.labels && broker.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {broker.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={broker.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <FiExternalLink className="mr-2 w-4 h-4" />
              Official Website
            </a>
            <button className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200">
              <FiFileText className="mr-2 w-4 h-4" />
              Detailed Report
            </button>
            {broker.contact?.[0] && (
              <a
                href={`tel:${broker.contact[0]}`}
                className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
              >
                <FiPhone className="mr-2 w-4 h-4" />
                Contact Support
              </a>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Performance Overview
                </h3>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Environment Rating
                  </span>
                  <span className="font-medium text-gray-900">
                    {broker.environmentRating}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Success Rate</div>
                  <div className="text-sm font-medium mt-1">98.5%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Execution</div>
                  <div className="text-sm font-medium mt-1">0.1s</div>
                </div>
              </div>

              {/* Chart Container with fixed height */}
              <div className="relative h-[180px] w-full">
                <div className="absolute inset-0">
                  <ChartRadar />
                </div>
              </div>

              {/* Optional: Add legend or additional stats */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Updated: Daily</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
