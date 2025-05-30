'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { OrderStatus } from 'generated/prisma';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateOrderStatus } from './actions';

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: 'Awaiting Shipment',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
};

function StatusDropdown({ id, orderStatus }: { id: string; orderStatus: OrderStatus }) {
  const router = useRouter();

  async function onClickStatus(status: OrderStatus) {
    const result = await updateOrderStatus({ id, newStatus: status });

    if (result.success) router.refresh();
    else toast.error('There was an error updating status');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-52 flex justify-between items-center">
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className="size-4 ml-2 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem
            className={cn(
              'flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100',
              { 'bg-zinc-100': orderStatus === status }
            )}
            key={status}
            onClick={() => onClickStatus(status as OrderStatus)}
          >
            <Check
              className={cn(
                'mr-2 size-4 text-primary',
                orderStatus === status ? 'opacity-100' : 'opacity-0'
              )}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default StatusDropdown;
