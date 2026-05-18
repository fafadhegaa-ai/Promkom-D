// ============================================
// GPS UTILITIES - HAVERSINE FORMULA
// ============================================

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

// Convert degrees to radians
const toRad = (deg) => {
  return deg * (Math.PI / 180);
};

// Check if user is within radius
export const isWithinRadius = (userLat, userLon, classLat, classLon, radiusMeters) => {
  const distance = calculateDistance(userLat, userLon, classLat, classLon);
  return distance <= radiusMeters;
};

// Calculate speed (m/s) between two points
export const calculateSpeed = (lat1, lon1, lat2, lon2, time1, time2) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const timeDiffSeconds = (time2 - time1) / 1000;
  return distance / timeDiffSeconds;
};

// Check for impossible movement (speed > 500 km/h)
export const isImpossibleMovement = (lat1, lon1, lat2, lon2, time1, time2) => {
  const speedMs = calculateSpeed(lat1, lon1, lat2, lon2, time1, time2);
  const speedKmh = speedMs * 3.6;
  const MAX_SPEED = 500; // km/h threshold
  return speedKmh > MAX_SPEED;
};

// Format coordinates with precision
export const formatCoordinates = (latitude, longitude) => {
  return {
    lat: parseFloat(latitude.toFixed(8)),
    lon: parseFloat(longitude.toFixed(8))
  };
};

// Validate GPS coordinates
export const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return { valid: false, message: 'Koordinat tidak valid' };
  }

  if (lat < -90 || lat > 90) {
    return { valid: false, message: 'Latitude harus antara -90 dan 90' };
  }

  if (lon < -180 || lon > 180) {
    return { valid: false, message: 'Longitude harus antara -180 dan 180' };
  }

  return { valid: true };
};

// Get client IP address
export const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';
};

// Generate device ID based on user agent
export const generateDeviceId = (userAgent) => {
  // In production, use a proper library like fingerprintjs2
  // This is a simple implementation
  const crypto = await import('crypto');
  return crypto
    .createHash('sha256')
    .update(userAgent)
    .digest('hex');
};

export default {
  calculateDistance,
  isWithinRadius,
  calculateSpeed,
  isImpossibleMovement,
  formatCoordinates,
  validateCoordinates,
  getClientIP,
  generateDeviceId,
};
