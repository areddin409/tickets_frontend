import NavBar from '@/components/nav-bar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatusEnum,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from '@/domain/domain';
import { createEvent, getEvent, updateEvent } from '@/lib/api';
import { format } from 'date-fns';
import {
  AlertCircle,
  CalendarIcon,
  Clock,
  Edit,
  Plus,
  Ticket,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router';

interface DateTimeSelectProperties {
  date: Date | undefined;
  setDate: (date: Date) => void;
  time: string | undefined;
  setTime: (time: string) => void;
  enabled: boolean;
  setEnabled: (isEnabled: boolean) => void;
}

const DateTimeSelect: React.FC<DateTimeSelectProperties> = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  // Convert 24-hour time to 12-hour format with AM/PM
  const get12HourFormat = (time24: string | undefined) => {
    if (!time24) return { hour: '12', minute: '00', period: 'PM' };
    const [hourStr, minute] = time24.split(':');
    const hour24 = parseInt(hourStr);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return { hour: String(hour12).padStart(2, '0'), minute, period };
  };

  // Convert 12-hour format to 24-hour time
  const to24HourFormat = (hour12: string, minute: string, period: string) => {
    let hour24 = parseInt(hour12);
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    return `${String(hour24).padStart(2, '0')}:${minute}`;
  };

  const { hour, minute, period } = get12HourFormat(time);

  return (
    <div className="flex gap-2 items-center">
      <Switch checked={enabled} onCheckedChange={setEnabled} />

      {enabled && (
        <div className="w-full flex gap-2">
          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gray-900 border-gray-700 border">
                <CalendarIcon />
                {date ? format(date, 'PPP') : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-gray-900 border-gray-700"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={selectedDate => {
                  if (!selectedDate) {
                    return;
                  }
                  // Create a local date at midnight to avoid timezone offset issues
                  const localDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    0,
                    0,
                    0,
                    0
                  );

                  setDate(localDate);
                }}
                className="rounded-md"
                classNames={{
                  months: 'flex flex-col sm:flex-row gap-2',
                  month: 'flex flex-col gap-4',
                  caption:
                    'flex justify-center pt-1 relative items-center text-white',
                  caption_label: 'text-sm font-medium text-white',
                  nav_button:
                    'size-7 bg-transparent p-0 text-gray-400 hover:text-white hover:bg-gray-800',
                  head_cell:
                    'text-gray-400 rounded-md w-8 font-normal text-[0.8rem]',
                  cell: 'text-white',
                  day: 'size-8 p-0 font-normal text-white hover:bg-gray-800 hover:rounded-md aria-selected:opacity-100',
                  day_selected:
                    'bg-purple-700 text-white hover:bg-purple-600 focus:bg-purple-700 rounded-md',
                  day_today: 'bg-gray-800 text-white rounded-md',
                  day_outside: 'text-gray-600 opacity-50',
                  day_disabled: 'text-gray-600 opacity-50',
                }}
              />
            </PopoverContent>
          </Popover>
          {/* Time */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gray-900 border-gray-700 border">
                <Clock className="h-4 w-4 mr-2" />
                {time ? `${hour}:${minute} ${period}` : 'Pick time'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-3 bg-gray-900 border-gray-700"
              align="start"
            >
              <Label className="text-xs text-gray-400 mb-2 block">Time</Label>
              <div className="flex gap-2">
                {/* Hour */}
                <Select
                  value={hour}
                  onValueChange={newHour => {
                    setTime(to24HourFormat(newHour, minute, period));
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                    {Array.from({ length: 12 }, (_, i) => {
                      const h = i + 1;
                      return (
                        <SelectItem
                          key={h}
                          value={String(h).padStart(2, '0')}
                          className="text-white hover:bg-gray-700 hover:text-white focus:bg-purple-700 focus:text-white"
                        >
                          {String(h).padStart(2, '0')}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <span className="flex items-center text-white">:</span>

                {/* Minute */}
                <Select
                  value={minute}
                  onValueChange={newMinute => {
                    setTime(to24HourFormat(hour, newMinute, period));
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                    {['00', '15', '30', '45'].map(min => (
                      <SelectItem
                        key={min}
                        value={min}
                        className="text-white hover:bg-gray-700 hover:text-white focus:bg-purple-700 focus:text-white"
                      >
                        {min}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* AM/PM */}
                <Select
                  value={period}
                  onValueChange={newPeriod => {
                    setTime(to24HourFormat(hour, minute, newPeriod));
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem
                      value="AM"
                      className="text-white hover:bg-gray-700 hover:text-white focus:bg-purple-700 focus:text-white"
                    >
                      AM
                    </SelectItem>
                    <SelectItem
                      value="PM"
                      className="text-white hover:bg-gray-700 hover:text-white focus:bg-purple-700 focus:text-white"
                    >
                      PM
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id: string | undefined) => id && id.startsWith('temp_');

interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface EventData {
  id: string | undefined;
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  ticketTypes: TicketTypeData[];
  status: EventStatusEnum;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

const DashboardManageEventPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventData>({
    id: undefined,
    name: '',
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: '',
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);

  const [error, setError] = useState<string | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        setEventData({
          id: event.id,
          name: event.name,
          startDate: event.start,
          startTime: event.start
            ? formatTimeFromDate(new Date(event.start))
            : undefined,
          endDate: event.end,
          endTime: event.end
            ? formatTimeFromDate(new Date(event.end))
            : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart,
          salesStartTime: event.salesStart
            ? formatTimeFromDate(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd,
          salesEndTime: event.salesEnd
            ? formatTimeFromDate(new Date(event.salesEnd))
            : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            totalAvailable: ticket.totalAvailable,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
        setEventDateEnabled(!!(event.start || event.end));
        setEventSalesDateEnabled(!!(event.salesStart || event.salesEnd));
      };
      fetchEvent();
    }
  }, [id, user]);

  const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time
      .split(':')
      .map(num => Number.parseInt(num, 10));

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    const utcResult = new Date(
      Date.UTC(
        combinedDateTime.getFullYear(),
        combinedDateTime.getMonth(),
        combinedDateTime.getDate(),
        hours,
        minutes,
        0,
        0
      )
    );

    return utcResult;
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const ticketTypes: UpdateTicketTypeRequest[] = eventData.ticketTypes.map(
      ticketType => {
        return {
          id: isTempId(ticketType.id) ? undefined : ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      }
    );

    const request: UpdateEventRequest = {
      id: id,
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate('/dashboard/events');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEventCreateSubmit = async (accessToken: string) => {
    const ticketTypes: CreateTicketTypeRequest[] = eventData.ticketTypes.map(
      ticketType => {
        return {
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      }
    );

    const request: CreateEventRequest = {
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await createEvent(accessToken, request);
      navigate('/dashboard/events');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user || !user.access_token) {
      console.error('User not found!');
      return;
    }

    // Validate that if date is selected, time must also be selected
    if (eventDateEnabled) {
      if (eventData.startDate && !eventData.startTime) {
        setError('Please select a start time for the event');
        return;
      }
      if (eventData.endDate && !eventData.endTime) {
        setError('Please select an end time for the event');
        return;
      }
    }

    if (eventSalesDateEnabled) {
      if (eventData.salesStartDate && !eventData.salesStartTime) {
        setError('Please select a start time for ticket sales');
        return;
      }
      if (eventData.salesEndDate && !eventData.salesEndTime) {
        setError('Please select an end time for ticket sales');
        return;
      }
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError('Event does not have an ID');
        return;
      }
      await handleEventUpdateSubmit(user.access_token, eventData.id);
    } else {
      await handleEventCreateSubmit(user.access_token);
    }
  };

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: '',
      price: 0,
      totalAvailable: 0,
      description: '',
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) {
      return;
    }

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex(
        t => t.id === currentTicketType.id
      );
      if (index !== -1) {
        newTicketTypes[index] = currentTicketType;
      }
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField('ticketTypes', newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType: TicketTypeData) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id: string | undefined) => {
    if (!id) {
      return;
    }
    updateField(
      'ticketTypes',
      eventData.ticketTypes.filter(t => t.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Event' : 'Create a New Event'}
          </h1>
          {isEditMode ? (
            <>
              {eventData.id && (
                <p className="text-sm text-gray-400">ID: {eventData.id}</p>
              )}
              {eventData.createdAt && (
                <p className="text-sm text-gray-400">
                  Created At: {format(eventData.createdAt, 'PPP')}
                </p>
              )}
              {eventData.updatedAt && (
                <p className="text-sm text-gray-400">
                  Updated At: {format(eventData.updatedAt, 'PPP')}
                </p>
              )}
            </>
          ) : (
            <p>Fill out the form below to create your event</p>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <div>
              <label htmlFor="event-name" className="text-sm font-medium">
                Event Name
              </label>
              <Input
                id="event-name"
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="Event Name"
                value={eventData.name}
                onChange={e => updateField('name', e.target.value)}
                required
              />
            </div>
            <p className="text-gray-400 text-xs">
              This is the public name of your event.
            </p>
          </div>

          {/* Event Start Date Time */}
          <div>
            <label className="text-sm font-medium">Event Start</label>
            <DateTimeSelect
              date={eventData.startDate}
              setDate={date => updateField('startDate', date)}
              time={eventData.startTime}
              setTime={time => updateField('startTime', time)}
              enabled={eventDateEnabled}
              setEnabled={setEventDateEnabled}
            />
            <p className="text-gray-400 text-xs">
              The date and time that the event starts.
            </p>
          </div>

          {/* Event End Date Time */}
          <div>
            <label className="text-sm font-medium">Event End</label>
            <DateTimeSelect
              date={eventData.endDate}
              setDate={date => updateField('endDate', date)}
              time={eventData.endTime}
              setTime={time => updateField('endTime', time)}
              enabled={eventDateEnabled}
              setEnabled={setEventDateEnabled}
            />
            <p className="text-gray-400 text-xs">
              The date and time that the event ends.
            </p>
          </div>

          <div>
            <label htmlFor="venue-details" className="text-sm font-medium">
              Venue Details
            </label>
            <Textarea
              id="venue-details"
              className="bg-gray-900 border-gray-700 min-h-[100px]"
              value={eventData.venueDetails}
              onChange={e => updateField('venueDetails', e.target.value)}
            />
            <p className="text-gray-400 text-xs">
              Details about the venue, please include as much detail as
              possible.
            </p>
          </div>

          {/* Event Sales Start Date Time */}
          <div>
            <label className="text-sm font-medium">Event Sales Start</label>
            <DateTimeSelect
              date={eventData.salesStartDate}
              setDate={date => updateField('salesStartDate', date)}
              time={eventData.salesStartTime}
              setTime={time => updateField('salesStartTime', time)}
              enabled={eventSalesDateEnabled}
              setEnabled={setEventSalesDateEnabled}
            />
            <p className="text-gray-400 text-xs">
              The date and time that ticket are available to purchase for the
              event.
            </p>
          </div>

          {/* Event Sales End Date Time */}
          <div>
            <label className="text-sm font-medium">Event Sales End</label>
            <DateTimeSelect
              date={eventData.salesEndDate}
              setDate={date => updateField('salesEndDate', date)}
              time={eventData.salesEndTime}
              setTime={time => updateField('salesEndTime', time)}
              enabled={eventSalesDateEnabled}
              setEnabled={setEventSalesDateEnabled}
            />
            <p className="text-gray-400 text-xs">
              The date and time that ticket are available to purchase for the
              event.
            </p>
          </div>

          {/* Ticket Types */}
          <div>
            <Card className="bg-gray-900 border-gray-700 text-white">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="flex gap-2 items-center text-sm">
                      <Ticket />
                      Ticket Types
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={() => handleAddTicketType()}
                      className="bg-gray-800 border-gray-700 text-white"
                    >
                      <Plus /> Add Ticket Type
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {eventData.ticketTypes.map(ticketType => {
                    return (
                      <div
                        key={ticketType.id}
                        className="bg-gray-700 w-full p-4 rounded-lg border-gray-600"
                      >
                        <div className="flex justify-between items-center">
                          {/* Left */}
                          <div>
                            <div className="flex gap-4">
                              <p className="text-small font-medium">
                                {ticketType.name}
                              </p>
                              <Badge
                                variant="outline"
                                className="border-gray-600 text-white font-normal text-xs"
                              >
                                ${ticketType.price}
                              </Badge>
                            </div>
                            {ticketType.totalAvailable && (
                              <p className="text-gray-400">
                                {ticketType.totalAvailable} tickets available
                              </p>
                            )}
                          </div>
                          {/* Right */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleEditTicketType(ticketType)}
                            >
                              <Edit />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-400"
                              onClick={() =>
                                handleDeleteTicketType(ticketType.id)
                              }
                            >
                              <Trash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Add Ticket Type</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Please enter details of the ticket type
                    </DialogDescription>
                  </DialogHeader>

                  {/* Ticket Type Name */}
                  <div className="space-y-1">
                    <Label htmlFor="ticket-type-name">Name</Label>
                    <Input
                      id="ticket-type-name"
                      className="bg-gray-800 border-gray-700"
                      value={currentTicketType?.name}
                      onChange={e =>
                        setCurrentTicketType(
                          currentTicketType
                            ? { ...currentTicketType, name: e.target.value }
                            : undefined
                        )
                      }
                      placeholder="e.g General Admission, VIP, etc."
                    />
                  </div>

                  <div className="flex gap-4">
                    {/* Price */}
                    <div className="space-y-1 w-full">
                      <Label htmlFor="ticket-type-price">Price</Label>
                      <Input
                        id="ticket-type-price"
                        type="number"
                        value={currentTicketType?.price}
                        onChange={e =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                  ...currentTicketType,
                                  price: Number.parseFloat(e.target.value),
                                }
                              : undefined
                          )
                        }
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>

                    {/* Total Available */}
                    <div className="space-y-1 w-full">
                      <Label htmlFor="ticket-type-total-available">
                        Total Available
                      </Label>
                      <Input
                        id="ticket-type-total-available"
                        type="number"
                        value={currentTicketType?.totalAvailable}
                        onChange={e =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                  ...currentTicketType,
                                  totalAvailable: Number.parseFloat(
                                    e.target.value
                                  ),
                                }
                              : undefined
                          )
                        }
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Ticket Type Description */}
                  <div className="space-y-1">
                    <Label htmlFor="ticket-type-description">Description</Label>
                    <Textarea
                      id="ticket-type-description"
                      className="bg-gray-800 border-gray-700"
                      value={currentTicketType?.description}
                      onChange={e =>
                        setCurrentTicketType(
                          currentTicketType
                            ? {
                                ...currentTicketType,
                                description: e.target.value,
                              }
                            : undefined
                        )
                      }
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      className="bg-white text-black hover:bg-gray-300"
                      onClick={handleSaveTicketType}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={eventData.status}
              onValueChange={value => updateField('status', value)}
            >
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select Event Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value={EventStatusEnum.DRAFT}>Draft</SelectItem>
                <SelectItem value={EventStatusEnum.PUBLISHED}>
                  Published
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-gray-400 text-xs">
              Please select the status of the new event.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-gray-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Button onClick={handleFormSubmit}>
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
        {/* For Development Only */}
        {/* <p className="mt-8 font-mono text-white">{JSON.stringify(eventData)}</p> */}
      </div>
    </div>
  );
};

export default DashboardManageEventPage;
