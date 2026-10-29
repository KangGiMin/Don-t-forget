import { formatLocalDate } from '../../../shared/utils/date';

export const VIEW_FILTERS = ['오늘', '모든 할 일', '예정', '완료'];
export const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

export const toDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const toIso = (date) => formatLocalDate(date);

export const weekStart = (value) => {
  const date = toDate(value);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
};