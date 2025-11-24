import React from 'react';
import { CalendarEvent } from './CalendarView.types';
import { getWeekDays, isTodayUtil, getDayName, getDayNumber, getTimeSlots } from '@/utils/date.utils';
import { getEventsForDate } from '@/utils/event.utils';
import { clsx } from 'clsx';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WeekViewComponent: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const weekDays = React.useMemo(() => getWeekDays(currentDate), [currentDate]);
  const timeSlots = React.useMemo(() => getTimeSlots(), []);

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const endHour = event.endDate.getHours();
    const endMinute = event.endDate.getMinutes();
    
    const hourHeight = window.innerWidth < 1024 ? 48 : 64; // Responsive hour height
    const top = (startHour + startMinute / 60) * hourHeight;
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * hourHeight;
    
    return { top, height: Math.max(height, 24) }; // Minimum height
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b border-neutral-200">
        <div className="p-2 lg:p-3 bg-neutral-50 border-r border-neutral-200 text-xs text-neutral-600">Time</div>
        {weekDays.map(date => {
          const isToday = isTodayUtil(date);
          return (
            <div
              key={date.toISOString()}
              className={clsx(
                'p-2 lg:p-3 text-center border-r border-neutral-200 last:border-r-0 cursor-pointer hover:bg-neutral-50',
                isToday && 'bg-primary-50'
              )}
              onClick={() => onDateClick(date)}
            >
              <div className="text-xs text-neutral-600 uppercase tracking-wide">
                <span className="hidden sm:inline">{getDayName(date)}</span>
                <span className="sm:hidden">{getDayName(date).charAt(0)}</span>
              </div>
              <div className={clsx(
                'text-sm lg:text-lg font-semibold mt-1',
                isToday ? 'text-primary-600' : 'text-neutral-900'
              )}>
                {getDayNumber(date)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="relative overflow-auto max-h-96 lg:max-h-[600px]">
        <div className="grid grid-cols-8">
          {/* Time labels */}
          <div className="border-r border-neutral-200">
            {timeSlots.map(time => (
              <div
                key={time}
                className="h-12 lg:h-16 px-1 lg:px-2 py-1 text-xs text-neutral-600 border-b border-neutral-100 flex items-start"
              >
                <span className="hidden sm:inline">{time}</span>
                <span className="sm:hidden">{time.split(':')[0]}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(date => {
            const dayEvents = getEventsForDate(events, date);
            
            return (
              <div
                key={date.toISOString()}
                className="relative border-r border-neutral-200 last:border-r-0"
              >
                {/* Time slots */}
                {timeSlots.map(time => (
                  <div
                    key={time}
                    className="h-12 lg:h-16 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => onDateClick(date)}
                  />
                ))}

                {/* Events */}
                {dayEvents.map(event => {
                  const { top, height } = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 px-2 py-1 text-xs text-white rounded cursor-pointer hover:opacity-80 transition-opacity z-10"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: event.color || '#3b82f6',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      title={`${event.title} - ${event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {height > 40 && (
                        <div className="text-xs opacity-90 truncate">
                          {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WeekView = React.memo(WeekViewComponent);