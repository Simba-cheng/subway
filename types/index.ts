import type { Color, Position } from '@deck.gl/core/typed'

export type Bound = [[number, number], [number, number]]

export interface Station {
  id: string
  name: string
  coord: Position
}

export interface Line {
  id: string
  name: string
  color: Color
  bound: Bound
  stations: Station[]
  polyline: [number, number][]
}

export interface City { id: string; name: string; lines: Line[]; bound: Bound }

export type Dataset = City[]

export type CitySelections = City[]
