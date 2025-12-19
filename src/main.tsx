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
    startDate: new Date(2025, 0, 15, 9, 0),
    endDate: new Date(2025, 0, 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(2025, 0, 15, 14, 0),
    endDate: new Date(2025, 0, 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    description: 'Present Q1 roadmap to stakeholders',
    startDate: new Date(2025, 0, 16, 10, 0),
    endDate: new Date(2025, 0, 16, 11, 30),
    color: '#8b5cf6',
    category: 'Presentation',
  },
  {
    id: 'evt-4',
    title: 'Code Review',
    description: 'Review calendar component implementation',
    startDate: new Date(2025, 0, 17, 15, 0),
    endDate: new Date(2025, 0, 17, 16, 0),
    color: '#f59e0b',
    category: 'Development',
  },
];

const App = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventManager(sampleEvents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <CalendarView
          events={events}
          onEventAdd={(event) => addEvent(event)}
          onEventUpdate={(id, updates) => updateEvent(id, updates)}
          onEventDelete={(id) => deleteEvent(id)}
        />
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)