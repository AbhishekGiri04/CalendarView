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
      className="w-full max-w-7xl mx-auto p-6"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Calendar application"
    >
      {/* Modern Header with Glass Effect */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-white/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setShowDatePicker(!showDatePicker)}>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {displayTitle}
                </h1>
                <div className="p-2 rounded-lg bg-slate-100/80 group-hover:bg-slate-200/80 transition-colors">
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {showDatePicker && (
              <div className="flex gap-3 p-4 glass-effect rounded-xl shadow-xl border border-white/30 animate-in slide-in-from-top-2 duration-200">
                <Select
                  options={getMonthsInYear(currentYear).map(m => ({ value: m.value.toString(), label: m.label }))}
                  value={currentMonth.toString()}
                  onChange={handleMonthChange}
                  className="w-36"
                />
                <Select
                  options={getYearRange(currentYear).map(year => ({ value: year.toString(), label: year.toString() }))}
                  value={currentYear.toString()}
                  onChange={handleYearChange}
                  className="w-24"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-slate-100/60 rounded-xl p-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                aria-label={`Previous ${view}`}
                className="rounded-lg hover:bg-white/80"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={goToToday}
                className="px-4 font-semibold"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                aria-label={`Next ${view}`}
                className="rounded-lg hover:bg-white/80"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex bg-slate-100/60 rounded-xl p-1.5 backdrop-blur-sm">
              <Button
                variant={view === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
                className="rounded-lg font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className="rounded-lg font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Week
              </Button>
            </div>
            <Button
              variant="gradient"
              onClick={() => setModalState({ isOpen: true, initialDate: new Date() })}
              className="w-full sm:w-auto font-semibold"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Event</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
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