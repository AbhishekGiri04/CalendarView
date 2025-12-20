import { useState, useCallback } from 'react';
import { ViewType } from '@/components/Calendar/CalendarView.types';
import { navigateMonth, navigateWeek } from '@/utils/date.utils';

interface CalendarState {
  currentDate: Date;
  view: ViewType;
  selectedDate: Date | null;
}

export const useCalendar = (initialDate: Date = new Date(), initialView: ViewType = 'month') => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: initialView,
    selectedDate: null,
  });

  const goToNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: prev.view === 'month' 
        ? navigateMonth(prev.currentDate, 'next')
        : navigateWeek(prev.currentDate, 'next'),
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: prev.view === 'month' 
        ? navigateMonth(prev.currentDate, 'prev')
        : navigateWeek(prev.currentDate, 'prev'),
    }));
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(),
    }));
  }, []);

  const setView = useCallback((view: ViewType) => {
    setState(prev => ({
      ...prev,
      view,
    }));
  }, []);

  const selectDate = useCallback((date: Date | null) => {
    setState(prev => ({
      ...prev,
      currentDate: date || prev.currentDate,
      selectedDate: date,
    }));
  }, []);

  return {
    ...state,
    goToNext,
    goToPrevious,
    goToToday,
    setView,
    selectDate,
  };
};