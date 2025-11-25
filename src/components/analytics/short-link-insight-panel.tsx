import { Cpu, Globe, Laptop, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { getUrlInsightsAction } from '@/server/get-url-insight-action'

export const ShortLinkInsightsPanel = async () => {
  const data = await getUrlInsightsAction()

  const renderList = (obj: Record<string, number>) => {
    const entries = Object.entries(obj)

    if (entries.length === 0) {
      return <p className="text-sm text-muted-foreground mt-4">No data available yet</p>
    }

    return (
      <div className="space-y-2 mt-4">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="grid grid-cols-3 items-center justify-between rounded-lg border p-3 text-xs md:text-sm"
          >
            <div className="font-medium col-span-2">{key}</div>
            <div className="text-muted-foreground text-center">{value} clicks</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="h-full hover:card-bg">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="location">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="location">
              <MapPin className="h-4 w-4 mr-2 hidden md:block" /> Location
            </TabsTrigger>

            <TabsTrigger value="device">
              <Laptop className="h-4 w-4 mr-2 hidden md:block" /> Device
            </TabsTrigger>

            <TabsTrigger value="os">
              <Cpu className="h-4 w-4 mr-2 hidden md:block" /> OS
            </TabsTrigger>

            <TabsTrigger value="browser">
              <Globe className="h-4 w-4 mr-2 hidden md:block" /> Browser
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location">{renderList(data.location)}</TabsContent>

          <TabsContent value="device">{renderList(data.device)}</TabsContent>

          <TabsContent value="os">{renderList(data.os)}</TabsContent>

          <TabsContent value="browser">{renderList(data.browser)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
