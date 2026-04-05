import { useEffect, useRef, useState } from 'react';
import { CirclePlus, ListFilter, RefreshCcw } from 'lucide-react';
import type { SortKey, SortOrder } from '../../types/IProduct';
import { cn } from '../../lib/cn';

interface ProductsPageActionsProps {
  loading: boolean;
  total: number;
  productsCount: number;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onSort: (key: SortKey) => void;
  sortBy: SortKey | null;
  order: SortOrder;
}

function useClickOutside<T extends HTMLElement>(
  open: boolean,
  onOutsideClick: () => void,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        onOutsideClick();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, onOutsideClick]);

  return ref;
}

export default function ProductsPageActions({
  loading,
  total,
  productsCount,
  onRefresh,
  onOpenAddModal,
  onSort,
  sortBy,
  order,
}: ProductsPageActionsProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const sortLabel = (() => {
    if (!sortBy) return 'Сортировка';
    const base =
      sortBy === 'price' ? 'Цена' : sortBy === 'rating' ? 'Оценка' : 'Название';
    const suffix = order === 'desc' ? ' ↓' : order === 'asc' ? ' ↑' : '';
    return `${base}${suffix}`;
  })();

  const popupRef = useClickOutside<HTMLDivElement>(isMobileFilterOpen, () =>
    setIsMobileFilterOpen(false),
  );

  return (
    <div className="flex items-start sm:items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-[20px] font-bold text-[#333] font-cairo">Все позиции</h2>
        <p className="text-[13px] text-grey-medium sm:hidden">
          Показано <span className="text-[#333]">1-{productsCount}</span> из{' '}
          <span className="text-[#333]">{total}</span>
        </p>
      </div>

      <div className="flex items-center gap-[8px] shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          className="p-[10px] rounded-[8px] border border-[#ececeb] bg-white hover:bg-grey-light transition-colors"
          aria-label="Обновить"
        >
          <RefreshCcw
            className={cn('w-[22px] h-[22px] text-grey-medium', loading && 'animate-spin')}
          />
        </button>

        <div className="relative flex items-center gap-[8px]" ref={popupRef}>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="bg-primary text-[#ebf3ea] px-[14px] sm:px-[20px] py-[10px] rounded-[6px] flex items-center gap-[10px] sm:gap-[15px] font-semibold text-[14px] font-cairo hover:bg-[#1d26c0] transition-colors"
          >
            <CirclePlus className="w-[22px] h-[22px]" />
            <span className="hidden sm:inline">Добавить</span>
            <span className="sm:hidden">Добавить товар</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen((v) => !v)}
            className="sm:hidden p-[10px] rounded-[8px] border border-[#ececeb] bg-white hover:bg-grey-light transition-colors"
            aria-haspopup="menu"
            aria-expanded={isMobileFilterOpen}
            aria-label="Фильтры"
          >
            <ListFilter className="w-[22px] h-[22px] text-grey-medium" />
          </button>

          {isMobileFilterOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[52px] z-50 w-[220px] rounded-[12px] border border-[#ececeb] bg-white shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="px-4 py-3 text-[12px] font-semibold text-grey-medium">
                {sortLabel}
              </div>
              <div className="h-px bg-[#ececeb]" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMobileFilterOpen(false);
                  onSort('rating');
                }}
                className={cn(
                  'w-full text-left px-4 py-3 text-[14px] font-semibold font-cairo hover:bg-grey-light transition-colors',
                  sortBy === 'rating' && 'text-primary',
                )}
              >
                По оценке
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMobileFilterOpen(false);
                  onSort('price');
                }}
                className={cn(
                  'w-full text-left px-4 py-3 text-[14px] font-semibold font-cairo hover:bg-grey-light transition-colors',
                  sortBy === 'price' && 'text-primary',
                )}
              >
                По цене
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMobileFilterOpen(false);
                  onSort('title');
                }}
                className={cn(
                  'w-full text-left px-4 py-3 text-[14px] font-semibold font-cairo hover:bg-grey-light transition-colors',
                  sortBy === 'title' && 'text-primary',
                )}
              >
                По названию
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

