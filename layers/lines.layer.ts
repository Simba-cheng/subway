import { CompositeLayer } from '@deck.gl/core/typed'

import { PathLayer, ScatterplotLayer } from '@deck.gl/layers/typed'
import type { Line, Station } from '~/types'

class LineLayer extends CompositeLayer<{ line: Line }> {
  renderLayers() {
    const line = this.props.line
    if (!line)
      return []
    return [new PathLayer<[number, number][]>({
      id: `${line.id}polyline`,
      data: line.polyline,
      getColor: line.color,
      pickable: false,
      autoHighlight: true,
      widthScale: 15,
      widthMinPixels: 2,
      widthMaxPixels: 3,
      getPath: () => line.polyline,
      getWidth: 5,
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
      getPosition: data => data.coord,
      getFillColor: line.color,
    })]
  }
}
LineLayer.layerName = 'LineLayer'
LineLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default LineLayer
