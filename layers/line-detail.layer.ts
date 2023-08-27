import { CompositeLayer } from '@deck.gl/core/typed'

import { PathLayer } from '@deck.gl/layers/typed'
import StationsLayer from './stations.layer'
import type { Line } from '~/types'

class LineDetailLayer extends CompositeLayer<{ id: string; data: Line }> {
  renderLayers() {
    const id = this.props.id
    const line = this.props.data

    if (!line)
      return []
    return [
      new PathLayer<[number, number][]>({
        id: 'detail-polyline',
        data: line.polyline,
        getColor: line.color,
        widthScale: 15,
        widthMinPixels: 5,
        widthMaxPixels: 7,
        pickable: false,
        getPath: () => line.polyline,
      }),
      new StationsLayer({ id: 'detail-stations', data: line, size: 'lg' }),
    ]
  }
}
LineDetailLayer.layerName = 'LineDetailLayer'
LineDetailLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default LineDetailLayer
