import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';
import { useEventManager } from '@/hooks/useEventManager';

// Sample events for stories
const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(2024, 0, 15, 9, 0),
    endDate: new Date(2024, 0, 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(2024, 0, 15, 14, 0),
    endDate: new Date(2024, 0, 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(2024, 0, 16, 10, 0),
    endDate: new Date(2024, 0, 16, 11, 30),
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    startDate: new Date(2024, 0, 17, 9, 0),
    endDate: new Date(2024, 0, 17, 17, 0),
    color: '#8b5cf6',
    category: 'Work',
  },
];

// Generate many events for large dataset story
const generateManyEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#84cc16'];
  const categories = ['Meeting', 'Work', 'Personal', 'Appointment'];
  
  for (let i = 0; i < 25; i++) {
    const startDate = new Date(2024, 0, Math.floor(Math.random() * 31) + 1, Math.floor(Math.random() * 8) + 9);
    const endDate = new Date(startDate.getTime() + (Math.random() * 3 + 0.5) * 60 * 60 * 1000);
    
    events.push({
      id: `evt-${i}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      startDate,
      endDate,
      color: colors[Math.floor(Math.random() * colors.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }
  
  return events;
};

interface CalendarWrapperProps {
  initialEvents?: CalendarEvent[];
  initialView?: 'month' | 'week';
  initialDate?: Date;
}

const CalendarWrapper = ({ initialEvents = [], ...props }: CalendarWrapperProps) => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventManager(initialEvents);
  
  return (
    <CalendarView
      events={events}
      onEventAdd={(event) => addEvent(event)}
      onEventUpdate={(id, updates) => updateEvent(id, updates)}
      onEventDelete={(id) => deleteEvent(id)}
      {...props}
    />
  );
};

const meta: Meta<typeof CalendarWrapper> = {
  title: 'Calendar/CalendarView',
  component: CalendarWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully interactive calendar component with month and week views, event management, and accessibility features.',
      },
    },
  },
  argTypes: {
    initialEvents: {
      description: 'Initial events to display',
    },
    initialView: {
      control: { type: 'select' },
      options: ['month', 'week'],
      description: 'Initial view mode',
    },
    initialDate: {
      control: { type: 'date' },
      description: 'Initial date to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialEvents: sampleEvents,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default calendar view with sample events in month mode.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    initialEvents: [],
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty calendar with no events to demonstrate the clean state.',
      },
    },
  },
};

export const WeekView: Story = {
  args: {
    initialEvents: sampleEvents,
    initialView: 'week',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Week view showing time slots and event positioning.',
      },
    },
  },
};

export const WithManyEvents: Story = {
  args: {
    initialEvents: generateManyEvents(),
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with 25+ events to test performance and layout with large datasets.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    initialEvents: sampleEvents,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive calendar where you can add, edit, and delete events. Try clicking on dates or existing events!',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    initialEvents: sampleEvents,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Calendar optimized for mobile devices with responsive layout.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  args: {
    initialEvents: sampleEvents,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation. Use Tab to navigate, Arrow keys to move between dates, Enter to select, and Escape to close modals.',
      },
    },
  },
};