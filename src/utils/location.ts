export const getDistanceBetweenLocations = (
  location1: {
    lat: number
    lon: number
  },
  location2: { lat: number; lon: number }
) => {
  const R = 6371

  const dLat = deg2rad(location1.lat - location2?.lat)
  const dLon = deg2rad(location1.lon - location2.lon)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(location1.lat)) *
      Math.cos(deg2rad(location2?.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

export const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
}
