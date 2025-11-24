import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const isSameDayUtil = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const isTodayUtil = (date: Date): boolean => {
  return isToday(date);
};

export const isSameMonthUtil = (date: Date, monthDate: Date): boolean => {
  return isSameMonth(date, monthDate);
};

export const getCalendarGrid = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const getWeekDays = (date: Date): Date[] => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

export const navigateMonth = (date: Date, direction: 'next' | 'prev'): Date => {
  return direction === 'next' ? addMonths(date, 1) : subMonths(date, 1);
};

export const navigateWeek = (date: Date, direction: 'next' | 'prev'): Date => {
  return direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1);
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const getWeekRange = (date: Date): string => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
};

export const getDayName = (date: Date): string => {
  return format(date, 'EEE');
};

export const getDayNumber = (date: Date): number => {
  return date.getDate();
};

export const getTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

/**
 * Calculates the number of days between two dates
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMs = start.getTime();
  const endMs = end.getTime();
  return Math.floor((endMs - startMs) / msPerDay);
};

/**
 * Gets all days in a month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysCount = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysCount }, (_, i) => new Date(year, month, i + 1));
};

/**
 * Gets the months for year picker
 */
export const getMonthsInYear = (year: number): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(year, i, 1), 'MMMM')
  }));
};

/**
 * Gets years for year picker
 */
export const getYearRange = (currentYear: number, range: number = 10): number[] => {
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
};