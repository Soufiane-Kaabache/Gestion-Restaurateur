import React, { useMemo, useCallback } from 'react';
import { DayPicker, type Matcher } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import { format, isSameDay, setHours, setMinutes } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';

export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabledDays?: number[]; // 0 = Sunday
  minDate?: Date;
  maxDate?: Date;
  timeSlots?: string[];
  showTimeSelect?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_TIME_SLOTS = [
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '19:00',
  '19:15',
  '19:30',
  '19:45',
  '20:00',
  '20:15',
  '20:30',
  '20:45',
  '21:00',
  '21:15',
  '21:30',
];

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  disabledDays = [],
  minDate = new Date(),
  maxDate,
  timeSlots = DEFAULT_TIME_SLOTS,
  showTimeSelect = true,
  error,
  className,
  disabled = false,
}) => {
  const disabledMatchers = useMemo<Matcher[]>(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    disabledDays.forEach((d) => matchers.push({ dayOfWeek: [d] } as unknown as Matcher));
    return matchers;
  }, [minDate, maxDate, disabledDays]);

  const handleDaySelect = useCallback(
    (day: Date | undefined) => {
      if (!day || disabled) return;
      let newDate = new Date(day);
      if (value && isSameDay(value, day)) {
        newDate = setHours(newDate, value.getHours());
        newDate = setMinutes(newDate, value.getMinutes());
      } else if (timeSlots.length > 0) {
        const [hh, mm] = timeSlots[0].split(':').map(Number);
        newDate = setHours(newDate, hh);
        newDate = setMinutes(newDate, mm);
      }
      onChange(newDate);
    },
    [value, onChange, timeSlots, disabled],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (disabled) return;
      const time = e.target.value;
      if (!time) return;
      const [hh, mm] = time.split(':').map(Number);
      const baseDate = value || new Date();
      let newDate = new Date(baseDate);
      newDate = setHours(newDate, hh);
      newDate = setMinutes(newDate, mm);
      newDate.setSeconds(0, 0);
      onChange(newDate);
    },
    [value, onChange, disabled],
  );

  const currentTime = value ? format(value, 'HH:mm') : '';

  return (
    <div
      className={cn(
        'datepicker-component space-y-4',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      data-testid="datetime-picker"
    >
      <div className="rounded-lg border p-3">
        <DayPicker
          mode="single"
          selected={value}
          onSelect={handleDaySelect}
          locale={fr}
          disabled={disabledMatchers}
          modifiersClassNames={{
            selected: 'bg-primary text-primary-foreground',
            today: 'font-bold text-primary',
            disabled: 'text-muted-foreground opacity-50',
          }}
          className="m-0"
        />
      </div>

      {showTimeSelect && (
        <div className="space-y-2">
          <label htmlFor="time-select" className="block text-sm font-medium text-foreground">
            Heure de réservation
          </label>
          <select
            id="time-select"
            aria-label="Sélectionner une heure"
            className={cn(
              'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus:ring-destructive',
            )}
            value={currentTime}
            onChange={handleTimeChange}
            disabled={disabled || !value}
            data-testid="time-select"
          >
            <option value="" disabled>
              {value ? 'Choisir un créneau' : "Sélectionnez d'abord une date"}
            </option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {value && (
        <div className="rounded-md bg-muted p-3 text-sm" data-testid="datetime-preview">
          <p className="font-medium">Réservation sélectionnée:</p>
          <p className="text-muted-foreground">
            {format(value, 'EEEE d MMMM yyyy', { locale: fr })} à {currentTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
