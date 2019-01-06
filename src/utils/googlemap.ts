import * as querystring from 'query-string';
import { http } from './http';
import { config } from '../config';

export function getDirectionUrl(origin, destination) {
  const query = {
    api: 1,
    origin,
    destination,
    travelmode: 'driving',
    key: config.googleAppKey,
  };
  const googleApiUrl = `https://www.google.com/maps/dir/?${querystring.stringify(query)}`;
  return googleApiUrl;
}

export async function getDistance(origin, destination) {
  const query = {
    language: 'th',
    origins: origin,
    destinations: destination,
    mode: 'driving',
    key: config.googleAppKey,
  };
  const googleApiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?${querystring.stringify(query)}`;
  const result = await http.get(googleApiUrl);
  if (result && result.body && result.body.rows && result.body.rows.length) {
    const row = result.body.rows[0];
    if (row.elements && row.elements.length && row.elements[0].distance) {
      return row.elements[0].distance.text;
    }
  }
  return 'N/A';
}

export function toLatLngString(location) {
  return `${location[1]},${location[0]}`;
}