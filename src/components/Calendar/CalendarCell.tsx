import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import { CalendarCellProps } from './CalendarView.types';
import { getDayNumber } from '@/utils/date.utils';

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  events,
  isToday,
  isSelected,
  isCurrentMonth,
  onClick,
  onEventClick,
}) => {
  const dayNumber = getDayNumber(date);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const maxEvents = isMobile ? 1 : 3;
  const visibleEvents = events.slice(0, maxEvents);
  const hasMoreEvents = events.length > maxEvents;

  const handleClick = useCallback(() => {
    onClick(date);
  }, [date, onClick]);

  const handleEventClick = useCallback((event: React.MouseEvent, eventItem: any) => {
    event.stopPropagation();
    onEventClick(eventItem);
  }, [onEventClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(date);
    }
  }, [date, onClick]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${date.toLocaleDateString()}. ${events.length} events.`}
      aria-pressed={isSelected}
      className={clsx(
        'border border-neutral-200 h-20 sm:h-24 lg:h-32 p-1 sm:p-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'hover:bg-neutral-50',
        isSelected && 'bg-primary-50 border-primary-300',
        !isCurrentMonth && 'text-neutral-400 bg-neutral-50'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex justify-between items-start mb-1">
        {isToday ? (
          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
            {dayNumber}
          </span>
        ) : (
          <span className={clsx(
            'text-xs sm:text-sm font-medium',
            isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
          )}>
            {dayNumber}
          </span>
        )}
      </div>
      
      <div className="space-y-0.5 sm:space-y-1 overflow-hidden">
        {visibleEvents.map(event => (
          <div
            key={event.id}
            className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
            onClick={(e) => handleEventClick(e, event)}
            title={event.title}
          >
            <span className="hidden sm:inline">{event.title}</span>
            <span className="sm:hidden">•</span>
          </div>
        ))}
        {hasMoreEvents && (
          <button 
            className="text-xs text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onClick(date);
            }}
          >
            <span className="hidden sm:inline">+{events.length - maxEvents} more</span>
            <span className="sm:hidden">+{events.length - maxEvents}</span>
          </button>
        )}
      </div>
    </div>
  );
});