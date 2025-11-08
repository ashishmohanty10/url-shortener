export function fillMissingDays(data: { date: string; clicks: number }[], daysBack: number = 365) {
  if (data.length === 0) return []

  const result = []
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)

  // Create a map of existing data for quick lookup
  const dataMap = new Map()
  data.forEach(item => {
    dataMap.set(item.date, item.clicks)
  })

  // Generate all dates in the range
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0]
    result.push({
      date: dateString,
      clicks: dataMap.get(dateString) || 0,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}
