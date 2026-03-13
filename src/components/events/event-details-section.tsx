import { DateTimePicker } from '@/components/events/date-time-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventStatusEnum } from '@/domain/domain';
import { cn } from '@/lib/utils';

interface EventDetailsSectionProps {
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  status: EventStatusEnum;
  onNameChange: (v: string) => void;
  onStartDateChange: (d: Date | undefined) => void;
  onStartTimeChange: (t: string | undefined) => void;
  onEndDateChange: (d: Date | undefined) => void;
  onEndTimeChange: (t: string | undefined) => void;
  onVenueChange: (v: string) => void;
  onStatusChange: (s: EventStatusEnum) => void;
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  name,
  startDate,
  startTime,
  endDate,
  endTime,
  venueDetails,
  status,
  onNameChange,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
  onVenueChange,
  onStatusChange,
}) => {
  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6">
      {/* Event Title */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-300">
          Event title <span className="text-red-400">*</span>
        </Label>
        <Input
          className="bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-md h-11 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
          placeholder="e.g. Product demo 02"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          required
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DateTimePicker
          date={startDate}
          time={startTime}
          onDateChange={onStartDateChange}
          onTimeChange={onStartTimeChange}
          label="Start date and time"
          required
        />
        <DateTimePicker
          date={endDate}
          time={endTime}
          onDateChange={onEndDateChange}
          onTimeChange={onEndTimeChange}
          label="End date and time"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-300">Location</Label>
        <Input
          className="bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-md h-11 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
          placeholder="Add location or address"
          value={venueDetails}
          onChange={e => onVenueChange(e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-300">Status</Label>
        <div className="flex gap-2">
          {([EventStatusEnum.DRAFT, EventStatusEnum.PUBLISHED] as const).map(
            s => (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(s)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  status === s
                    ? 'bg-zinc-700 text-white border border-zinc-600'
                    : 'bg-transparent text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'
                )}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
