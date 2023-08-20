import hexRgb from 'hex-rgb'
import rawData from '~/datasource/data.json'
import type { Dataset } from '~/types'

export function useDataset() {
  return ref<Dataset>(
    rawData.map(city => ({
      id: city.id,
      name: city.name,
      lines: city.lines.map(line => ({
        id: line.id,
        name: line.name,
        color: hexRgb(line.color, { format: 'array', alpha: 255 }),
        stations: line.stations.map(station => ({ id: station.id, name: station.name, coord: transformGCJ02([station.lng, station.lat]) })),
        polyline: (line.fullPolyline.length ? line.fullPolyline : extractPolyline(line.polyline)) as [number, number][],
      })),
    })),
  )
}
