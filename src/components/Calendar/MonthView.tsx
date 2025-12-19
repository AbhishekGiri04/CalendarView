import React from 'react';
import { CalendarCell } from './CalendarCell';
import { CalendarEvent } from './CalendarView.types';
import { getCalendarGrid, isTodayUtil, isSameMonthUtil, isSameDayUtil } from '@/utils/date.utils';
import { getEventsForDate } from '@/utils/event.utils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const MonthViewComponent: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  selectedDate,
  onDateClick,
  onEventClick,
}) => {
  const calendarDays = React.useMemo(() => getCalendarGrid(currentDate), [currentDate]);
  const weekDays = React.useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

  return (
    <div className="glass-effect rounded-2xl border border-white/20 overflow-hidden shadow-2xl shadow-slate-900/10">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-blue-50/40">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 lg:p-4 text-center text-sm lg:text-base font-semibold text-slate-700 backdrop-blur-sm"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 bg-white/40 backdrop-blur-sm">
        {calendarDays.map(date => {
          const dateEvents = getEventsForDate(events, date);
          const isToday = isTodayUtil(date);
          const isCurrentMonth = isSameMonthUtil(date, currentDate);
          const isSelected = selectedDate ? isSameDayUtil(date, selectedDate) : false;

          return (
            <CalendarCell
              key={date.toISOString()}
              date={date}
              events={dateEvents}
              isToday={isToday}
              isSelected={isSelected}
              isCurrentMonth={isCurrentMonth}
              onClick={onDateClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export const MonthView = React.memo(MonthViewComponent);