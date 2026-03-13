import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Ticket, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TicketTypeData, TicketTypeDialog } from './ticket-type-dialog';

const generateTempId = () => `temp_${crypto.randomUUID()}`;

interface TicketTypesSectionProps {
  ticketTypes: TicketTypeData[];
  onTicketTypesChange: (ticketTypes: TicketTypeData[]) => void;
}

export const TicketTypesSection: React.FC<TicketTypesSectionProps> = ({
  ticketTypes,
  onTicketTypesChange,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const handleSave = () => {
    if (!currentTicketType) return;
    const next = [...ticketTypes];
    if (currentTicketType.id) {
      const i = next.findIndex(t => t.id === currentTicketType.id);
      if (i !== -1) next[i] = currentTicketType;
    } else {
      next.push({ ...currentTicketType, id: generateTempId() });
    }
    onTicketTypesChange(next);
    setDialogOpen(false);
  };

  const handleDelete = (id: string | undefined) => {
    onTicketTypesChange(ticketTypes.filter(t => t.id !== id));
  };

  const openAdd = () => {
    setCurrentTicketType({
      id: undefined,
      name: '',
      price: 0,
      totalAvailable: 0,
      description: '',
    });
    setDialogOpen(true);
  };

  const openEdit = (t: TicketTypeData) => {
    setCurrentTicketType(t);
    setDialogOpen(true);
  };

  return (
    <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Ticket Types</h3>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white text-sm rounded-md hover:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add ticket type
        </button>
      </div>

      {ticketTypes.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-zinc-700 rounded-lg">
          <Ticket className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">No ticket types created yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ticketTypes.map(t => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors bg-zinc-800/30"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-white">{t.name}</p>
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
                  onClick={() => openEdit(t)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ticketType={currentTicketType}
        onTicketTypeChange={setCurrentTicketType}
        onSave={handleSave}
      />
    </div>
  );
};
