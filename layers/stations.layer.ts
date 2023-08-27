import { CompositeLayer } from '@deck.gl/core/typed'

import { ScatterplotLayer } from '@deck.gl/layers/typed'
import type { Line, Station } from '~/types'

class StationsLayer extends CompositeLayer<{ id: string; data: Line; selected?: boolean; size?: 'sm' | 'lg' }> {
  renderLayers() {
    const line = this.props.data
    const size = this.props.size || 'sm'

    if (!line)
      return []
    return [
      new ScatterplotLayer<Station>({
        id: `${this.props.id || ''}stations`,
        data: line.stations,

        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 12,
        radiusMinPixels: size === 'sm' ? 2 : 3,
        radiusMaxPixels: size === 'sm' ? 2 : 4,
        lineWidthMinPixels: 1,
        getFillColor: line.color,
        getPosition: data => data.coord,
      }),

    ]
  }
}
StationsLayer.layerName = 'StationsLayer'
StationsLayer.defaultProps = {
  pickable: true,
  autoHighlight: true,
}

export default StationsLayer
