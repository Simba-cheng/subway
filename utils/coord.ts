import gcoord from 'gcoord'

type LAT = number
type LNG = number

export function transformGCJ02(raw: [LAT, LNG]) {
  return gcoord.transform(raw, gcoord.GCJ02, gcoord.WGS84)
}

export function transformStringToGCJ02(str: string) {
  return str.split(',').reverse().map(Number) as [LAT, LNG]
}
