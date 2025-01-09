"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  kilometrage: {
    label: "Kilometrage",
    color: "#ea580c",
  },
  carburant: {
    label: "Carburant",
    color: "#22c55e",
  },
  lub: {
    label: "Lub",
    color: "#eab308",
  },
  carb_ext: {
    label: "Carb_ext",
    color: "#ef4444",
  },
  rechange: {
    label: "Rechange",
    color: "#6366f1",
  },
} satisfies ChartConfig

export function Graphiques({ chartData }: { chartData: { month: string, kilometrage: number, carburant: number, carb_ext: number, lub: number, rechange: number }[] }) {
  return (
    <ChartContainer className="print:w-full pt-4 print:flex print:justify-center print:items-center" config={chartConfig} id="graph">
      <BarChart accessibilityLayer data={chartData} className="print:min-w-full print:min-h-full">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="_id"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="kilometrage" fill="var(--color-kilometrage)" radius={4} />
        <Bar dataKey="carburant" fill="var(--color-carburant)" radius={4} />
        <Bar dataKey="carb_ext" fill="var(--color-carb_ext)" radius={4} />
        <Bar dataKey="lub" fill="var(--color-lub)" radius={4} />
        <Bar dataKey="rechange" fill="var(--color-rechange)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
