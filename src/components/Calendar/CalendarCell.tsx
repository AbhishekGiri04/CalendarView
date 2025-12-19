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
        'border border-slate-200/50 h-20 sm:h-24 lg:h-32 p-2 sm:p-3 cursor-pointer transition-all duration-200 group relative overflow-hidden',
        'hover:bg-white/80 hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/60 hover:-translate-y-0.5',
        isSelected && 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300/60 shadow-lg shadow-blue-500/10',
        isToday && 'bg-gradient-to-br from-blue-100/80 to-purple-100/60 border-blue-400/60',
        !isCurrentMonth && 'text-slate-400 bg-slate-50/50 hover:bg-slate-100/60'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex justify-between items-start mb-2">
        {isToday ? (
          <div className="relative">
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
              {dayNumber}
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
        ) : (
          <span className={clsx(
            'text-sm sm:text-base font-semibold transition-colors',
            isCurrentMonth ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-400'
          )}>
            {dayNumber}
          </span>
        )}
      </div>
      
      <div className="space-y-1 overflow-hidden">
        {visibleEvents.map(event => (
          <div
            key={event.id}
            className="text-xs px-2 py-1 rounded-lg truncate cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md backdrop-blur-sm border border-white/20"
            style={{ 
              backgroundColor: event.color || '#3b82f6', 
              color: 'white',
              boxShadow: `0 2px 8px ${event.color || '#3b82f6'}20`
            }}
            onClick={(e) => handleEventClick(e, event)}
            title={event.title}
          >
            <span className="hidden sm:inline font-medium">{event.title}</span>
            <span className="sm:hidden">•</span>
          </div>
        ))}
        {hasMoreEvents && (
          <button 
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
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
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
});