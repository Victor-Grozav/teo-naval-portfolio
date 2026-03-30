'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

interface ProjectMapProps {
  lat: number
  lng: number
  title: string
}

// Leaflet needs to be loaded only client-side
function MapInner({ lat, lng, title }: ProjectMapProps) {
  useEffect(() => {
    // Fix leaflet default marker icon
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  // Dynamic imports for SSR safety
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet')

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={[lat, lng]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  )
}

export default function ProjectMap(props: ProjectMapProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapInner {...props} />
    </div>
  )
}
