import { DateTimePicker } from '@/components/events/date-time-picker';

interface TicketSalesWindowProps {
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  onSalesStartDateChange: (d: Date | undefined) => void;
  onSalesStartTimeChange: (t: string | undefined) => void;
  onSalesEndDateChange: (d: Date | undefined) => void;
  onSalesEndTimeChange: (t: string | undefined) => void;
}

export const TicketSalesWindow: React.FC<TicketSalesWindowProps> = ({
  salesStartDate,
  salesStartTime,
  salesEndDate,
  salesEndTime,
  onSalesStartDateChange,
  onSalesStartTimeChange,
  onSalesEndDateChange,
  onSalesEndTimeChange,
}) => {
  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">
        Ticket Sales Window
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DateTimePicker
          date={salesStartDate}
          time={salesStartTime}
          onDateChange={onSalesStartDateChange}
          onTimeChange={onSalesStartTimeChange}
          label="Sales start"
        />
        <DateTimePicker
          date={salesEndDate}
          time={salesEndTime}
          onDateChange={onSalesEndDateChange}
          onTimeChange={onSalesEndTimeChange}
          label="Sales end"
        />
      </div>
    </div>
  );
};
