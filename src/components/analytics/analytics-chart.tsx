'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AnalyticsChartProps } from '@/utils/types'
import { chartConfig, TIME_RANGES } from '@/utils/constant'

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [timeRange, setTimeRange] = useState('90d')

  const filteredData = useMemo(() => {
    const selectedRange = TIME_RANGES.find(range => range.value === timeRange)
    if (!selectedRange || timeRange === 'all') return data

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - selectedRange.days)
    cutoffDate.setHours(0, 0, 0, 0)

    return data.filter(item => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate >= cutoffDate
    })
  }, [data, timeRange])

  const totalClicks = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.clicks, 0)
  }, [filteredData])

  // Smart X-axis formatting based on time range
  const getXAxisTickFormat = (value: string) => {
    const date = new Date(value)
    const selectedRange = TIME_RANGES.find(range => range.value === timeRange)

    if (!selectedRange) return value

    switch (selectedRange.value) {
      case '7d':
        // For 7 days: Show day names and date
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      case '30d':
        // For 30 days: Show date and month
        return date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        })
      case '90d':
        // For 90 days: Show month and date, but skip some labels to avoid crowding
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      case '180d':
      case '270d':
        // For 6-9 months: Show month names
        return date.toLocaleDateString('en-US', {
          month: 'short',
        })
      case '365d':
      case 'all':
        // For 1 year+: Show month names
        return date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        })
      default:
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
    }
  }

  // Reduce label density for longer time ranges
  const getTickInterval = () => {
    switch (timeRange) {
      case '7d':
        return 0 // Show all days
      case '30d':
        return 2 // Show every 3rd day
      case '90d':
        return 6 // Show approximately weekly
      case '180d':
        return 14 // Show every 2 weeks
      case '270d':
        return 21 // Show every 3 weeks
      case '365d':
      case 'all':
        return 30 // Show monthly
      default:
        return 0
    }
  }

  return (
    <Card className="pt-0 hover:card-bg hover:bg-secondary">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Clicks Over Time</CardTitle>
          <CardDescription>
            Total clicks in selected period:{' '}
            <span className="font-semibold">{totalClicks.toLocaleString()}</span>
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg" aria-label="Select time range">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TIME_RANGES.map(range => (
              <SelectItem key={range.value} value={range.value} className="rounded-lg">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={20}
              interval={getTickInterval()}
              tickFormatter={getXAxisTickFormat}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.toLocaleString()}
              fontSize={12}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="url(#fillClicks)"
              stroke="var(--color-clicks)"
              strokeWidth={2}
              dot={filteredData.length <= 30}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
