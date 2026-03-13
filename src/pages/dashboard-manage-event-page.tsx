import { EventDetailsSection } from '@/components/events/event-details-section';
import { TicketSalesWindow } from '@/components/events/ticket-sales-window';
import { TicketTypeData } from '@/components/events/ticket-type-dialog';
import { TicketTypesSection } from '@/components/events/ticket-types-section';
import NavBar from '@/components/layout/nav-bar';
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatusEnum,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from '@/domain/domain';
import { createEvent, getEvent, updateEvent } from '@/lib/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router';

const isTempId = (id: string | undefined) => id && id.startsWith('temp_');

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
          startDate: event.start ? new Date(event.start) : undefined,
          startTime: event.start ? fmt(new Date(event.start)) : undefined,
          endDate: event.end ? new Date(event.end) : undefined,
          endTime: event.end ? fmt(new Date(event.end)) : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart
            ? new Date(event.salesStart)
            : undefined,
          salesStartTime: event.salesStart
            ? fmt(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd ? new Date(event.salesEnd) : undefined,
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
          <EventDetailsSection
            name={eventData.name}
            startDate={eventData.startDate}
            startTime={eventData.startTime}
            endDate={eventData.endDate}
            endTime={eventData.endTime}
            venueDetails={eventData.venueDetails}
            status={eventData.status}
            onNameChange={v => updateField('name', v)}
            onStartDateChange={d => updateField('startDate', d)}
            onStartTimeChange={t => updateField('startTime', t)}
            onEndDateChange={d => updateField('endDate', d)}
            onEndTimeChange={t => updateField('endTime', t)}
            onVenueChange={v => updateField('venueDetails', v)}
            onStatusChange={s => updateField('status', s)}
          />

          <TicketSalesWindow
            salesStartDate={eventData.salesStartDate}
            salesStartTime={eventData.salesStartTime}
            salesEndDate={eventData.salesEndDate}
            salesEndTime={eventData.salesEndTime}
            onSalesStartDateChange={d => updateField('salesStartDate', d)}
            onSalesStartTimeChange={t => updateField('salesStartTime', t)}
            onSalesEndDateChange={d => updateField('salesEndDate', d)}
            onSalesEndTimeChange={t => updateField('salesEndTime', t)}
          />

          <TicketTypesSection
            ticketTypes={eventData.ticketTypes}
            onTicketTypesChange={tt => updateField('ticketTypes', tt)}
          />

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
