import { CompositeLayer } from '@deck.gl/core/typed'

import { PathLayer, ScatterplotLayer } from '@deck.gl/layers/typed'
import type { Line, Station } from '~/types'

class LineLayer extends CompositeLayer<{ data: Line }> {
  renderLayers() {
    const line = this.props.data
    if (!line)
      return []
    return [new PathLayer<[number, number][]>({
      id: `${line.id}polyline`,
      data: line.polyline,
      getColor: line.color,
      pickable: true,
      autoHighlight: false,
      widthScale: 15,
      widthMinPixels: 2,
      widthMaxPixels: 3,
      getWidth: 5,
      getPath: () => line.polyline,
    }), new ScatterplotLayer<Station>({
      id: `${line.id}stations`,
      data: line.stations,
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
    })]
  }
}
LineLayer.layerName = 'LineLayer'
LineLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default LineLayer
