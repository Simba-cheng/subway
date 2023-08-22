import { CompositeLayer } from '@deck.gl/core/typed'

import { PathLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers/typed'
import type { Line, Station } from '~/types'

class LineLayer extends CompositeLayer<{ data: Line; selected?: boolean; stationVisible?: boolean }> {
  renderLayers() {
    const line = this.props.data
    const selected = this.props.selected
    const stationVisible = this.props.stationVisible ?? true

    if (!line)
      return []
    return [
      new PathLayer<[number, number][]>({
        id: `${line.id}polyline${selected && 'selected'}`,
        data: line.polyline,
        getColor: line.color,
        pickable: true,
        autoHighlight: false,
        widthScale: 15,
        widthMinPixels: selected ? 5 : 2,
        widthMaxPixels: selected ? 7 : 3,

        getPath: () => line.polyline,
      }),
      new ScatterplotLayer<Station>({
        id: `${line.id}stations${selected && 'selected'}`,
        data: line.stations,
        visible: stationVisible,
        opacity: 0.8,
        stroked: true,
        filled: true,
        pickable: false,

        // TODO 换乘站点特殊样式
        radiusScale: 12,
        radiusMinPixels: 2,
        radiusMaxPixels: 2,
        lineWidthMinPixels: 1,
        getFillColor: line.color,
        getPosition: data => data.coord,
      }),
      new TextLayer<Station>({
        id: `${line.id}text${selected && 'selected'}`,
        data: line.stations,
        visible: selected && stationVisible,
        pickable: true,
        getSize: 12,
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        characterSet: 'auto',
        getPosition: d => d.coord,
        getText: d => d.name,
        getPixelOffset: [10, -15],
        // getColor: [255, 255, 255],
      }),
    ]
  }
}
LineLayer.layerName = 'LineLayer'
LineLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default LineLayer
