import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { isSameDayUtil } from './date.utils';

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => 
    isSameDayUtil(event.startDate, date) || 
    (event.startDate <= date && event.endDate >= date)
  );
};

export const generateEventId = (): string => {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getEventColors = (): string[] => {
  return [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ef4444', // red
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
  ];
};

export const getDefaultEventColor = (): string => {
  return '#3b82f6';
};

export const validateEvent = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];
  
  if (!event.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (event.title && event.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  if (event.description && event.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  if (!event.startDate) {
    errors.push('Start date is required');
  }
  
  if (!event.endDate) {
    errors.push('End date is required');
  }
  
  if (event.startDate && event.endDate && event.startDate >= event.endDate) {
    errors.push('End date must be after start date');
  }
  
  return errors;
};