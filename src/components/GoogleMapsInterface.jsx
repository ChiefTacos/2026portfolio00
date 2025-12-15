import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const center = {
  lat: -3.745,
  lng: -38.523,
}

const mapWrapperStyle = {
  width: '320px',
  height: '320px',
  border: '1px solid #000',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
}

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: 'cooperative',
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b8b' }] },

    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2b2b2b' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#000000' }],
    },

    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0d0d0d' }],
    },

    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

function GoogleMapsInterface() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
  })

  if (!isLoaded) return null

  return (
    <div style={mapWrapperStyle}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        options={mapOptions}
      />
    </div>
  )
}

export default React.memo(GoogleMapsInterface)
