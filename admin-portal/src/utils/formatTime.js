import { format, getTime, formatDistanceToNow } from 'date-fns';
import { hy } from 'date-fns/locale';

function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';
  const formattedDate = date ? format(new Date(date), fm, { locale: hy }) : '';
  const parts = formattedDate.split(' ');
  if (parts.length === 3) {
    parts[1] = capitalizeFirstLetter(parts[1]);
  }
  return parts.join(' ');
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}
