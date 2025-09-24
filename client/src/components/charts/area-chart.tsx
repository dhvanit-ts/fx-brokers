import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

type ChartAreaShadCNProps<T extends Record<string, unknown>> = {
  data: T[];
  xKey: keyof T;
  title?: string;
  colors?: Record<string, string>;
  start?: number | string; // timestamp or string
  end?: number | string;
};

const formatTicks = (val: string | number) => {
  if (typeof val === "number" && val > 1000000000) {
    const date = new Date(val * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
  return val?.toString?.() ?? "";
};

export function ChartAreaShadCN<T extends Record<string, unknown>>({
  data,
  xKey,
  title,
  colors = {},
  start,
  end,
}: ChartAreaShadCNProps<T>) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]).filter((k) => k !== xKey);

  const chartConfig: Record<string, ChartConfig[string]> = {};
  keys.forEach((k) => {
    chartConfig[k] = { label: k, color: colors[k] || "" };
  });

  // Filter data by start/end
  const filteredData = data.filter((item) => {
    const value = item[xKey];
    if (start !== undefined && Number(value) < Number(start)) return false;
    if (end !== undefined && Number(value) > Number(end)) return false;
    return true;
  });

  return (
    <ChartContainer config={chartConfig} title={title}>
      <AreaChart data={filteredData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey as string} tickFormatter={formatTicks} />
        <YAxis
          tickFormatter={(val) => val.toLocaleString()} // optional formatting
          width={25} // optional, adjust based on your label size
        />
        <ChartTooltip
          cursor={false}
          wrapperStyle={{ top: 20 }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {keys.map((k) => (
          <Area
            key={k}
            dataKey={k}
            type="natural"
            fill={colors[k] || "var(--chart-1)"}
            fillOpacity={0.4}
            stroke={colors[k] || "var(--chart-1)"}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
