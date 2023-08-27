import { CompositeLayer } from '@deck.gl/core/typed'

import { ScatterplotLayer } from '@deck.gl/layers/typed'
import type { Line, Station } from '~/types'

class StationsLayer extends CompositeLayer<{ id: string; data: Line; selected?: boolean; stationVisible?: boolean }> {
  renderLayers() {
    const line = this.props.data
    const stationVisible = this.props.stationVisible ?? true

    if (!line)
      return []
    return [
      new ScatterplotLayer<Station>({
        id: `${line.id}-stations-layer`,
        data: line.stations,
        visible: stationVisible,
        opacity: 0.8,
        stroked: true,
        filled: true,

        radiusScale: 12,
        radiusMinPixels: 2,
        radiusMaxPixels: 2,
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
