import * as moment from 'moment';

export function displayDatetime(datetime) {
  return moment(datetime).format('DD/MM/YY HH:mm');
}

export function setTimeToGMT(datetime) {
  return moment(datetime).add(7, 'hour').toDate();
}
