import hexRgb from 'hex-rgb'
import first from 'lodash-es/first'
import rawData from '~/datasource/data.json'
import type { Bound, Dataset, Line, Station } from '~/types'

export function useDataset() {
  return ref<Dataset>(
    rawData.map((city) => {
      const lines = city.lines.map((line) => {
        const stations = line.stations.map(station => ({ id: station.id, name: station.name, coord: transformGCJ02([station.lng, station.lat]) }))
        return {
          id: line.id,
          cityId: city.id,
          name: line.name,
          bound: getLineBounds(stations),
          color: hexRgb(line.color, { format: 'array', alpha: 255 }),
          stations,
          polyline: (line.fullPolyline.length ? line.fullPolyline : extractPolyline(line.polyline)) as [number, number][],
        }
      })

      return {
        id: city.id,
        name: city.name,
        bound: getCityBound(lines),
        lines,
      }
    }),
  )
}

function getLineBounds(stations: Station[]) {
  const firstStation = first(stations)
  let maxLat = firstStation?.coord[1] || 0
  let minLat = maxLat
  let maxLng = firstStation?.coord[0] || 0
  let minLng = maxLng

  stations.forEach((station) => {
    const lng = station.coord[0]
    const lat = station.coord[1]
    if (lng > maxLng)
      maxLng = lng
    if (lng < minLng)
      minLng = lng
    if (lat > maxLat)
      maxLat = lat
    if (lat < minLat)
      minLat = lat
  })

  return [[minLng, minLat], [maxLng, maxLat]] as Bound
}

function getCityBound(lines: Line[]) {
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const line of lines) {
    for (const [lng, lat] of line.bound) {
      if (lng < minLng)
        minLng = lng
      if (lng > maxLng)
        maxLng = lng
      if (lat < minLat)
        minLat = lat
      if (lat > maxLat)
        maxLat = lat
    }
  }

  return [[minLng, minLat], [maxLng, maxLat]] as Bound
}
