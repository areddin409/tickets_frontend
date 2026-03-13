import { DateTimePicker } from '@/components/date-time-picker';
import NavBar from '@/components/nav-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  Plus,
  Ticket,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router';

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
  const [error, setError] = useState<string | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        const fmt = (d: Date) => {
          const h = d.getHours().toString().padStart(2, '0');
          const m = d.getMinutes().toString().padStart(2, '0');
          return `${h}:${m}`;
        };
        setEventData({
          id: event.id,
          name: event.name,
          startDate: event.start,
          startTime: event.start ? fmt(new Date(event.start)) : undefined,
          endDate: event.end,
          endTime: event.end ? fmt(new Date(event.end)) : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart,
          salesStartTime: event.salesStart
            ? fmt(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd,
          salesEndTime: event.salesEnd
            ? fmt(new Date(event.salesEnd))
            : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            price: t.price,
            totalAvailable: t.totalAvailable,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
      };
      fetchEvent();
    }
  }, [id, user]);

  const combine = (date: Date, time: string) => {
    const [h, m] = time.split(':').map(Number);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0)
    );
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const request: UpdateEventRequest = {
      id,
      name: eventData.name,
      venue: eventData.venueDetails,
      status: eventData.status,
      start:
        eventData.startDate && eventData.startTime
          ? combine(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combine(eventData.endDate, eventData.endTime)
          : undefined,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combine(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combine(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      ticketTypes: eventData.ticketTypes.map(t => ({
        id: isTempId(t.id) ? undefined : t.id,
        name: t.name,
        price: t.price,
        description: t.description,
        totalAvailable: t.totalAvailable,
      })) as UpdateTicketTypeRequest[],
    };
    try {
      await updateEvent(accessToken, id, request);
      navigate('/dashboard/events');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  const handleEventCreateSubmit = async (accessToken: string) => {
    const request: CreateEventRequest = {
      name: eventData.name,
      venue: eventData.venueDetails,
      status: eventData.status,
      start:
        eventData.startDate && eventData.startTime
          ? combine(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combine(eventData.endDate, eventData.endTime)
          : undefined,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combine(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combine(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      ticketTypes: eventData.ticketTypes.map(t => ({
        name: t.name,
        price: t.price,
        description: t.description,
        totalAvailable: t.totalAvailable,
      })) as CreateTicketTypeRequest[],
    };
    try {
      await createEvent(accessToken, request);
      navigate('/dashboard/events');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (isLoading || !user?.access_token) return;

    // Validate date/time pairs
    if (eventData.startDate && !eventData.startTime) {
      setError('Please select a start time for the event');
      return;
    }
    if (eventData.endDate && !eventData.endTime) {
      setError('Please select an end time for the event');
      return;
    }
    if (eventData.salesStartDate && !eventData.salesStartTime) {
      setError('Please select a start time for ticket sales');
      return;
    }
    if (eventData.salesEndDate && !eventData.salesEndTime) {
      setError('Please select an end time for ticket sales');
      return;
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

  const handleSaveTicketType = () => {
    if (!currentTicketType) return;
    const next = [...eventData.ticketTypes];
    if (currentTicketType.id) {
      const i = next.findIndex(t => t.id === currentTicketType.id);
      if (i !== -1) next[i] = currentTicketType;
    } else {
      next.push({ ...currentTicketType, id: generateTempId() });
    }
    updateField('ticketTypes', next);
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/dashboard/events')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                {isEditMode ? 'Event setup' : 'Create new event'}
              </h1>
              <p className="text-sm text-zinc-400">
                {isEditMode
                  ? 'Manage event URL and basic details.'
                  : 'Set up your event details and configuration.'}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="space-y-8 bg-zinc-100/10 p-6 rounded-lg border border-zinc-700"
        >
          {/* Main Form */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6">
            {/* Event Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Event title <span className="text-red-400">*</span>
              </Label>
              <Input
                className="bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-md h-11 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
                placeholder="e.g. Product demo 02"
                value={eventData.name}
                onChange={e => updateField('name', e.target.value)}
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DateTimePicker
                date={eventData.startDate}
                time={eventData.startTime}
                onDateChange={d => updateField('startDate', d)}
                onTimeChange={t => updateField('startTime', t)}
                label="Start date and time"
                required
              />

              <DateTimePicker
                date={eventData.endDate}
                time={eventData.endTime}
                onDateChange={d => updateField('endDate', d)}
                onTimeChange={t => updateField('endTime', t)}
                label="End date and time"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Location
              </Label>
              <Input
                className="bg-zinc-800/50 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-md h-11 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
                placeholder="Add location or address"
                value={eventData.venueDetails}
                onChange={e => updateField('venueDetails', e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Status
              </Label>
              <div className="flex gap-2">
                {(
                  [EventStatusEnum.DRAFT, EventStatusEnum.PUBLISHED] as const
                ).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateField('status', s)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-md transition-all',
                      eventData.status === s
                        ? 'bg-zinc-700 text-white border border-zinc-600'
                        : 'bg-transparent text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'
                    )}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Sales Window */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Ticket Sales Window
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DateTimePicker
                date={eventData.salesStartDate}
                time={eventData.salesStartTime}
                onDateChange={d => updateField('salesStartDate', d)}
                onTimeChange={t => updateField('salesStartTime', t)}
                label="Sales start"
              />

              <DateTimePicker
                date={eventData.salesEndDate}
                time={eventData.salesEndTime}
                onDateChange={d => updateField('salesEndDate', d)}
                onTimeChange={t => updateField('salesEndTime', t)}
                label="Sales end"
              />
            </div>
          </div>

          {/* Ticket Types */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Ticket Types</h3>
              <button
                type="button"
                onClick={() => {
                  setCurrentTicketType({
                    id: undefined,
                    name: '',
                    price: 0,
                    totalAvailable: 0,
                    description: '',
                  });
                  setDialogOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white text-sm rounded-md hover:bg-zinc-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add ticket type
              </button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              {eventData.ticketTypes.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-700 rounded-lg">
                  <Ticket className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">
                    No ticket types created yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventData.ticketTypes.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors bg-zinc-800/30"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-white">
                            {t.name}
                          </p>
                          <Badge className="bg-zinc-700 text-white border-0 text-xs font-medium rounded-md px-2 py-0.5">
                            ${t.price}
                          </Badge>
                        </div>
                        {t.totalAvailable && (
                          <p className="text-xs text-zinc-500 mt-1">
                            {t.totalAvailable} tickets available
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTicketType(t);
                            setDialogOpen(true);
                          }}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              'ticketTypes',
                              eventData.ticketTypes.filter(x => x.id !== t.id)
                            )
                          }
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DialogContent className="bg-zinc-900 border border-zinc-700 text-white rounded-lg max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white font-medium">
                    {currentTicketType?.id
                      ? 'Edit Ticket Type'
                      : 'Add Ticket Type'}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Configure ticket pricing and availability
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-zinc-300">
                      Ticket name
                    </Label>
                    <Input
                      className="bg-zinc-800/50 border border-zinc-700 text-white rounded-md focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
                      placeholder="e.g. General Admission, VIP"
                      value={currentTicketType?.name}
                      onChange={e =>
                        setCurrentTicketType(
                          currentTicketType
                            ? { ...currentTicketType, name: e.target.value }
                            : undefined
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-300">
                        Price ($)
                      </Label>
                      <Input
                        type="number"
                        className="bg-zinc-800/50 border border-zinc-700 text-white rounded-md focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
                        placeholder="0.00"
                        step="0.01"
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-300">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        className="bg-zinc-800/50 border border-zinc-700 text-white rounded-md focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
                        placeholder="100"
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
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-zinc-300">
                      Description
                    </Label>
                    <Textarea
                      className="bg-zinc-800/50 border border-zinc-700 text-white rounded-md min-h-[80px] resize-none focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
                      placeholder="What's included with this ticket?"
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
                </div>

                <DialogFooter>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <button
                    type="button"
                    onClick={handleSaveTicketType}
                    className="px-5 py-2 bg-zinc-700 text-white text-sm font-medium rounded-md hover:bg-zinc-600 transition-colors"
                  >
                    {currentTicketType?.id ? 'Save changes' : 'Add ticket type'}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-400">Error</p>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 pb-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard/events')}
              className="px-5 py-2.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-zinc-200 transition-colors"
            >
              {isEditMode ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardManageEventPage;
