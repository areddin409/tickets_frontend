'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';

interface DateTimePickerProps {
  date?: Date;
  time?: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * DateTimePicker component - combines a date picker and time selector
 * Displays date and time selection with a scrollable time picker
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
  label,
  required = false,
  disabled = false,
}) => {
  // Combine date and time into a single Date object for the picker
  const getDateTime = (): Date => {
    if (!date) return new Date();

    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      return newDate;
    }

    return date;
  };

  const dateTime = getDateTime();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // Preserve the time when changing date
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes(),
      0,
      0
    );

    onDateChange(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0,
        0
      )
    );

    // Update time in 24h format
    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');
    onTimeChange(`${hours}:${minutes}`);
  };

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    value: string
  ) => {
    const currentTime = time || '12:00';
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);

    let newHours = currentHours;
    let newMinutes = currentMinutes;

    if (type === 'hour') {
      const hour = parseInt(value, 10);
      const isPM = currentHours >= 12;
      newHours = isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;
    } else if (type === 'minute') {
      newMinutes = parseInt(value, 10);
    } else if (type === 'ampm') {
      if (value === 'AM' && currentHours >= 12) {
        newHours = currentHours - 12;
      } else if (value === 'PM' && currentHours < 12) {
        newHours = currentHours + 12;
      }
    }

    const timeString = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
  };

  const getDisplayHour = () => {
    const hours = dateTime.getHours();
    const hour12 = hours % 12 || 12;
    return hour12;
  };

  const getDisplayMinute = () => {
    return dateTime.getMinutes();
  };

  const getDisplayPeriod = () => {
    return dateTime.getHours() >= 12 ? 'PM' : 'AM';
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label className="text-sm font-medium text-zinc-300">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal bg-zinc-800/50 border border-zinc-700 text-white hover:bg-zinc-800 hover:text-white',
              !date && 'text-zinc-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
            {date && time ? (
              format(dateTime, 'MM/dd/yyyy hh:mm aa')
            ) : (
              <span>MM/DD/YYYY hh:mm aa</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-zinc-900 border border-zinc-700"
          align="start"
        >
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="rounded-lg"
              classNames={{
                // months: 'flex flex-col sm:flex-row gap-2',
                month: 'flex flex-col gap-2 p-3 relative',
                month_caption:
                  'flex h-9 w-full items-center justify-center px-0 mb-2',
                caption_label: 'text-sm font-semibold text-white',
                nav: 'absolute inset-x-0 top-3 flex items-center justify-between px-3 z-10',
                button_previous:
                  'size-7 bg-zinc-800/50 border border-zinc-700 p-0 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-md transition-colors flex items-center justify-center',
                button_next:
                  'size-7 bg-zinc-800/50 border border-zinc-700 p-0 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-md transition-colors flex items-center justify-center',
                weekdays: 'flex gap-1',
                weekday:
                  'text-zinc-400 w-9 font-semibold text-xs uppercase text-center',
                week: 'flex gap-1 mt-1 w-full',
                day: 'relative w-9 h-9 p-0 text-center',
                day_button:
                  'w-full h-full p-0 font-medium text-sm text-zinc-200 hover:bg-zinc-800/50 hover:text-white rounded-md transition-colors data-[selected-single=true]:bg-white data-[selected-single=true]:text-black data-[selected-single=true]:hover:bg-white data-[selected-single=true]:hover:text-black',
                // selected:
                //   'bg-white text-black font-semibold hover:bg-white hover:text-black',
                today: 'bg-zinc-800/30 text-zinc-100 ring-1 ring-zinc-700 rounded-md',
                outside: 'text-zinc-600 opacity-50',
                disabled: 'text-zinc-700 opacity-30',
              }}
            />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x divide-zinc-700">
              {/* Hours */}
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1)
                    .reverse()
                    .map(hour => (
                      <Button
                        key={hour}
                        size="icon"
                        type="button"
                        variant={
                          getDisplayHour() === hour ? 'default' : 'ghost'
                        }
                        className={cn(
                          'sm:w-full shrink-0 aspect-square',
                          getDisplayHour() === hour
                            ? 'bg-white text-black hover:bg-white hover:text-black'
                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        )}
                        onClick={() =>
                          handleTimeChange('hour', hour.toString())
                        }
                      >
                        {hour}
                      </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              {/* Minutes */}
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                    <Button
                      key={minute}
                      size="icon"
                      type="button"
                      variant={
                        getDisplayMinute() === minute ? 'default' : 'ghost'
                      }
                      className={cn(
                        'sm:w-full shrink-0 aspect-square',
                        getDisplayMinute() === minute
                          ? 'bg-white text-black hover:bg-white hover:text-black'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      )}
                      onClick={() =>
                        handleTimeChange('minute', minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              {/* AM/PM */}
              <ScrollArea className="">
                <div className="flex sm:flex-col p-2">
                  {['AM', 'PM'].map(ampm => (
                    <Button
                      key={ampm}
                      size="icon"
                      type="button"
                      variant={
                        getDisplayPeriod() === ampm ? 'default' : 'ghost'
                      }
                      className={cn(
                        'sm:w-full shrink-0 aspect-square',
                        getDisplayPeriod() === ampm
                          ? 'bg-white text-black hover:bg-white hover:text-black'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      )}
                      onClick={() => handleTimeChange('ampm', ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
