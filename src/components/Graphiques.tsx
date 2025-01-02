"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", kilometrage: 186, carburant: 80, carb_ext: 326, lub: 250, },
  { month: "February", kilometrage: 305, carburant: 200, carb_ext: 302, lub: 131, },
  { month: "March", kilometrage: 237, carburant: 120, carb_ext: 186, lub: 336, },
  { month: "April", kilometrage: 73, carburant: 190, carb_ext: 55, lub: 244, },
  { month: "May", kilometrage: 209, carburant: 130, carb_ext: 308, lub: 313, },
  { month: "June", kilometrage: 214, carburant: 140, carb_ext: 309, lub: 216, },
  { month: "July", kilometrage: 282, carburant: 24, carb_ext: 38, lub: 242, },
  { month: "August", kilometrage: 232, carburant: 142, carb_ext: 215, lub: 282, },
  { month: "September", kilometrage: 67, carburant: 187, carb_ext: 289, lub: 43, },
  { month: "October", kilometrage: 289, carburant: 20, carb_ext: 150, lub: 185, },
  { month: "November", kilometrage: 227, carburant: 138, carb_ext: 323, lub: 9, },
  { month: "December", kilometrage: 256, carburant: 103, carb_ext: 30, lub: 20, },
]

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
