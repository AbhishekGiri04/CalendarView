import React from 'react'
import ReactDOM from 'react-dom/client'
import { CalendarView } from './components/Calendar/CalendarView'
import { useEventManager } from './hooks/useEventManager'
import './styles/globals.css'

const sampleEvents = [
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
];

const App = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventManager(sampleEvents);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <CalendarView
        events={events}
        onEventAdd={(event) => addEvent(event)}
        onEventUpdate={(id, updates) => updateEvent(id, updates)}
        onEventDelete={(id) => deleteEvent(id)}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)