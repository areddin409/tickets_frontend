import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeSelectProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * TimeSelect component - displays a dropdown with time options in 12-hour format
 * Stores values internally as 24-hour format (HH:mm)
 */
export const TimeSelect: React.FC<TimeSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  className = '',
  disabled = false,
}) => {
  // Generate time options - every 30 minutes
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const time24 = `${String(hour).padStart(2, '0')}:${minute}`;

    // Convert to 12-hour format for display
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : 'PM';
    const display = `${hour12}:${minute} ${period}`;

    return { value: time24, label: display };
  });

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={`bg-zinc-800/50 border border-zinc-700 text-white rounded-md hover:bg-zinc-800 transition-colors ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border border-zinc-700 rounded-md max-h-[200px]">
        {timeOptions.map(({ value, label }) => (
          <SelectItem
            key={value}
            value={value}
            className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
