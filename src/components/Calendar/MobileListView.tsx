import React from 'react';
import { CalendarEvent } from './CalendarView.types';
import { getWeekDays, isTodayUtil, getDayName, getDayNumber, formatDate } from '@/utils/date.utils';
import { getEventsForDate } from '@/utils/event.utils';
import { clsx } from 'clsx';

interface MobileListViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const MobileListViewComponent: React.FC<MobileListViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const weekDays = React.useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="divide-y divide-neutral-200">
        {weekDays.map(date => {
          const dayEvents = getEventsForDate(events, date);
          const isToday = isTodayUtil(date);
          
          return (
            <div key={date.toISOString()} className="p-4">
              <div 
                className={clsx(
                  'flex items-center justify-between mb-3 cursor-pointer',
                  isToday && 'text-primary-600'
                )}
                onClick={() => onDateClick(date)}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                    isToday ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-900'
                  )}>
                    {getDayNumber(date)}
                  </div>
                  <div>
                    <div className="font-medium">{getDayName(date)}</div>
                    <div className="text-xs text-neutral-500">{formatDate(date, 'MMM d')}</div>
                  </div>
                </div>
                <button 
                  className="text-primary-600 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDateClick(date);
                  }}
                >
                  Add Event
                </button>
              </div>
              
              {dayEvents.length > 0 ? (
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: `${event.color}20`, borderLeft: `4px solid ${event.color}` }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-neutral-600 mt-1">
                        {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.description && (
                        <div className="text-xs text-neutral-500 mt-1 line-clamp-2">
                          {event.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-neutral-400 italic">No events</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MobileListView = React.memo(MobileListViewComponent);