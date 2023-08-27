import { CompositeLayer } from '@deck.gl/core/typed'

import { PathLayer } from '@deck.gl/layers/typed'
import StationsLayer from './stations.layer'
import type { Line } from '~/types'

class LineDetailLayer extends CompositeLayer<{ id: string; data: Line; pickable?: boolean; labels?: boolean }> {
  renderLayers() {
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
        pickable: this.props.pickable,
        getPath: () => line.polyline,
      }),
      new StationsLayer({ id: 'detail-stations', data: line, size: 'lg', labels: this.props.labels }),
    ]
  }
}
LineDetailLayer.layerName = 'LineDetailLayer'
LineDetailLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default LineDetailLayer
