import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../lib/cn';

interface ProductsPaginationProps {
  shownFrom: number;
  shownTo: number;
  total: number;
  className?: string;
}

export function ProductsPagination({
  shownFrom,
  shownTo,
  total,
  className,
}: ProductsPaginationProps) {
  return (
    <div className={cn('hidden sm:flex items-center justify-between py-[11px]', className)}>
      <p className="text-[18px] text-[#969b9f]">
        Показано <span className="text-[#333]">{shownFrom}-{shownTo}</span> из{' '}
        <span className="text-[#333]">{total}</span>
      </p>

      <div className="flex items-center gap-[16px]">
        <ChevronLeft className="w-5 h-5 text-grey-medium cursor-pointer" />
        <div className="flex items-center gap-[8px]">
          {[1, 2, 3, 4, 5].map((page) => (
            <div
              key={page}
              className={cn(
                'w-[30px] h-[30px] rounded-[4px] flex items-center justify-center text-[14px] cursor-pointer transition-all',
                page === 1
                  ? 'bg-[#797fea] text-white shadow-lg'
                  : 'border border-[#ececeb] text-grey-medium',
              )}
            >
              {page}
            </div>
          ))}
        </div>
        <ChevronRight className="w-5 h-5 text-grey-medium cursor-pointer" />
      </div>
    </div>
  );
}

