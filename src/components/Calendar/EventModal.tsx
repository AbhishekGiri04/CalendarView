import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import { Select } from '@/components/primitives/Select';
import { EventModalProps, CalendarEvent } from './CalendarView.types';
import { validateEvent, getEventColors, getDefaultEventColor } from '@/utils/event.utils';

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    color: getDefaultEventColor(),
    category: '',
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        color: event.color || getDefaultEventColor(),
        category: event.category || '',
      });
    } else if (initialDate) {
      const dateStr = initialDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
        title: '',
        description: '',
        category: '',
      }));
    }
  }, [event, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    const eventData: Partial<CalendarEvent> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate: startDateTime,
      endDate: endDateTime,
      color: formData.color,
      category: formData.category || undefined,
    };

    const validationErrors = validateEvent(eventData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalEvent: CalendarEvent = {
      id: event?.id || '',
      ...eventData as Required<Pick<CalendarEvent, 'title' | 'startDate' | 'endDate'>>,
    };

    onSave(finalEvent);
    onClose();
    setErrors([]);
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };



  const categoryOptions = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'appointment', label: 'Appointment' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Event' : 'Create Event'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <ul className="text-sm text-error-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date *
            </label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-neutral-700 mb-1">
              Start Time *
            </label>
            <input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-1">
              End Date *
            </label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-neutral-700 mb-1">
              End Time *
            </label>
            <input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-1">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {getEventColors().map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-neutral-900' : 'border-neutral-300'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              placeholder="Select category"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};