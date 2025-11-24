import React, { useState, useCallback, useEffect } from 'react';
import { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { MobileListView } from './MobileListView';
import { EventModal } from './EventModal';
import { Button } from '@/components/primitives/Button';
import { Select } from '@/components/primitives/Select';
import { useCalendar } from '@/hooks/useCalendar';
import { getMonthName, getWeekRange, getMonthsInYear, getYearRange } from '@/utils/date.utils';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date(),
}) => {
  const {
    currentDate,
    view,
    selectedDate,
    goToNext,
    goToPrevious,
    goToToday,
    setView,
    selectDate,
  } = useCalendar(initialDate, initialView);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    event?: CalendarEvent;
    initialDate?: Date;
  }>({
    isOpen: false,
  });

  const handleDateClick = useCallback((date: Date) => {
    selectDate(date);
    setModalState({
      isOpen: true,
      initialDate: date,
    });
  }, [selectDate]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setModalState({
      isOpen: true,
      event,
    });
  }, []);

  const handleModalClose = useCallback(() => {
    setModalState({ isOpen: false });
  }, []);

  const handleEventSave = useCallback((event: CalendarEvent) => {
    if (modalState.event) {
      onEventUpdate(event.id, event);
    } else {
      onEventAdd(event);
    }
  }, [modalState.event, onEventAdd, onEventUpdate]);

  const handleEventDelete = useCallback((id: string) => {
    onEventDelete(id);
  }, [onEventDelete]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToToday();
        break;
    }
  }, [goToNext, goToPrevious, goToToday]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleMonthChange = useCallback((month: string) => {
    const newDate = new Date(currentYear, parseInt(month), 1);
    selectDate(newDate);
  }, [currentYear, selectDate]);
  
  const handleYearChange = useCallback((year: string) => {
    const newDate = new Date(parseInt(year), currentMonth, 1);
    selectDate(newDate);
  }, [currentMonth, selectDate]);

  const displayTitle = view === 'month' ? getMonthName(currentDate) : getWeekRange(currentDate);

  return (
    <div 
      className="w-full max-w-7xl mx-auto p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Calendar application"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 cursor-pointer" onClick={() => setShowDatePicker(!showDatePicker)}>
              {displayTitle}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
              aria-label="Open date picker"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>
          
          {showDatePicker && (
            <div className="flex gap-2 p-2 bg-white border border-neutral-200 rounded-lg shadow-lg">
              <Select
                options={getMonthsInYear(currentYear).map(m => ({ value: m.value.toString(), label: m.label }))}
                value={currentMonth.toString()}
                onChange={handleMonthChange}
                className="w-32"
              />
              <Select
                options={getYearRange(currentYear).map(year => ({ value: year.toString(), label: year.toString() }))}
                value={currentYear.toString()}
                onChange={handleYearChange}
                className="w-20"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              aria-label={`Previous ${view}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              aria-label={`Next ${view}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <Button
              variant={view === 'month' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
          <Button
            onClick={() => setModalState({ isOpen: true, initialDate: new Date() })}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {isMobile && view === 'week' ? (
        <MobileListView
          currentDate={currentDate}
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      ) : view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          events={events}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          events={events}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        event={modalState.event}
        initialDate={modalState.initialDate}
      />
    </div>
  );
};