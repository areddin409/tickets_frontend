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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus } from 'lucide-react';

export interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface TicketTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketType: TicketTypeData | undefined;
  onTicketTypeChange: (t: TicketTypeData | undefined) => void;
  onSave: () => void;
}

export const TicketTypeDialog: React.FC<TicketTypeDialogProps> = ({
  open,
  onOpenChange,
  ticketType,
  onTicketTypeChange,
  onSave,
}) => {
  const update = (patch: Partial<TicketTypeData>) =>
    ticketType ? onTicketTypeChange({ ...ticketType, ...patch }) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-white rounded-lg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white font-medium">
            {ticketType?.id ? 'Edit Ticket Type' : 'Add Ticket Type'}
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
              value={ticketType?.name}
              onChange={e => update({ name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Price</Label>
              <InputGroup className="bg-zinc-800/50 border-zinc-700 focus-within:border-zinc-500 focus-within:ring-zinc-500">
                <InputGroupAddon align="inline-start">
                  <span className="text-zinc-400">$</span>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  className="text-white placeholder:text-zinc-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none selection:bg-white selection:text-black"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={ticketType?.price || ''}
                  onChange={e =>
                    update({
                      price: e.target.value
                        ? Number.parseFloat(e.target.value)
                        : 0,
                    })
                  }
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Quantity
              </Label>
              <InputGroup className="bg-zinc-800/50 border-zinc-700 focus-within:border-zinc-500 focus-within:ring-zinc-500">
                <InputGroupButton
                  size="icon-sm"
                  onClick={() =>
                    update({
                      totalAvailable: Math.max(
                        0,
                        (ticketType?.totalAvailable || 0) - 1
                      ),
                    })
                  }
                  className="text-zinc-400 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </InputGroupButton>
                <InputGroupInput
                  type="number"
                  className="text-white placeholder:text-zinc-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none selection:bg-white selection:text-black"
                  placeholder="100"
                  min="0"
                  value={ticketType?.totalAvailable || ''}
                  onChange={e =>
                    update({
                      totalAvailable: e.target.value
                        ? Number.parseFloat(e.target.value)
                        : 0,
                    })
                  }
                />
                <InputGroupButton
                  size="icon-sm"
                  onClick={() =>
                    update({
                      totalAvailable: (ticketType?.totalAvailable || 0) + 1,
                    })
                  }
                  className="text-zinc-400 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </InputGroupButton>
              </InputGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-300">
              Description
            </Label>
            <Textarea
              className="bg-zinc-800/50 border border-zinc-700 text-white rounded-md min-h-[80px] resize-none focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500"
              placeholder="What's included with this ticket?"
              value={ticketType?.description}
              onChange={e => update({ description: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 bg-zinc-700 text-white text-sm font-medium rounded-md hover:bg-zinc-600 transition-colors"
          >
            {ticketType?.id ? 'Save changes' : 'Add ticket type'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
