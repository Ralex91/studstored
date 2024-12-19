"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { schoolYear: "20XX - 20XX", numberOfStudents: 186 },
  { schoolYear: "20XX - 20XX", numberOfStudents: 305 },
  { schoolYear: "20XX - 20XX", numberOfStudents: 237 },
  { schoolYear: "20XX - 20XX", numberOfStudents: 73 },
  { schoolYear: "20XX - 20XX", numberOfStudents: 209 },
  { schoolYear: "20XX - 20XX", numberOfStudents: 214 },
]

const chartConfig = {
  numberOfStudents: {
    label: "numberOfStudents",
    color: "hsl(var(--chart-1))",
  },
}

export function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre d'élèves par année</CardTitle>
        <CardDescription>20XX - 20XX</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="schoolYear"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="numberOfStudents"
              fill="var(--color-numberOfStudents)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
