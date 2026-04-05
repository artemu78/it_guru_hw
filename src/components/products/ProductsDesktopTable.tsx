import {
  CheckSquare,
  CircleEllipsis,
  ListFilter,
  Plus,
  Square,
} from 'lucide-react';
import type { IProduct, SortKey } from '../../types/IProduct';
import { cn } from '../../lib/cn';

interface ProductsDesktopTableProps {
  products: IProduct[];
  loading: boolean;
  selectedIds: ReadonlySet<number>;
  allSelected: boolean;
  sortBy: SortKey | null;
  onToggleSelectAll: () => void;
  onToggleRowSelection: (id: number) => void;
  onSort: (key: SortKey) => void;
}

export function ProductsDesktopTable({
  products,
  loading,
  selectedIds,
  allSelected,
  sortBy,
  onToggleSelectAll,
  onToggleRowSelection,
  onSort,
}: ProductsDesktopTableProps) {
  return (
    <div className="relative overflow-x-auto hidden sm:block">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-grey-light overflow-hidden z-10">
          <div className="h-full bg-primary animate-progress-indeterminate w-[30%]" />
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="h-[73px] text-[#b2b3b9] text-[16px] font-bold font-cairo border-b border-[#e2e2e2]">
            <th className="px-[18px] w-[278px]">
              <div className="flex items-center gap-[20px]">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="inline-flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer rounded shrink-0 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  aria-pressed={allSelected}
                  aria-label={
                    allSelected ? 'Снять выделение со всех' : 'Выделить все'
                  }
                >
                  {allSelected ? (
                    <CheckSquare
                      className="w-[22px] h-[22px] text-primary"
                      strokeWidth={1.75}
                    />
                  ) : (
                    <Square
                      className="w-[22px] h-[22px] text-grey-medium"
                      strokeWidth={1.5}
                    />
                  )}
                </button>
                <span>Наименование</span>
              </div>
            </th>
            <th className="text-center w-[125px]">Вендор</th>
            <th className="text-center w-[125px]">Артикул</th>
            <th className="text-center w-[125px]">
              <button
                type="button"
                onClick={() => onSort('rating')}
                className="flex items-center justify-center gap-2 w-full bg-transparent hover:text-primary transition-colors p-0"
              >
                Оценка
                <ListFilter
                  className={cn(
                    'w-4 h-4',
                    sortBy === 'rating' && 'text-primary',
                  )}
                />
              </button>
            </th>
            <th className="text-center w-[125px]">
              <button
                type="button"
                onClick={() => onSort('price')}
                className="flex items-center justify-center gap-2 w-full bg-transparent hover:text-primary transition-colors p-0"
              >
                Цена, ₽
                <ListFilter
                  className={cn(
                    'w-4 h-4',
                    sortBy === 'price' && 'text-primary',
                  )}
                />
              </button>
            </th>
            <th className="w-[133px]"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => onToggleRowSelection(product.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleRowSelection(product.id);
                }
              }}
              className="group h-[71px] border-b border-[#e2e2e2] hover:bg-grey-light/20 transition-[background-color] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
            >
              <td
                className={cn(
                  'relative px-[18px]',
                  'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary before:opacity-0 before:transition-opacity before:duration-200 before:content-[""]',
                  'group-hover:before:opacity-100 group-focus-visible:before:opacity-100',
                )}
              >
                <div className="flex items-center gap-[18px]">
                  {selectedIds.has(product.id) ? (
                    <CheckSquare
                      className="w-[22px] h-[22px] text-primary shrink-0"
                      strokeWidth={1.75}
                    />
                  ) : (
                    <Square
                      className="w-[22px] h-[22px] text-grey-medium shrink-0"
                      strokeWidth={1.5}
                    />
                  )}
                  <div className="w-[48px] h-[48px] bg-[#c4c4c4] rounded-[8px] overflow-hidden">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-[#161919] font-cairo line-clamp-1">
                      {product.title}
                    </span>
                    <span className="text-[14px] text-grey-medium font-cairo">
                      {product.category}
                    </span>
                  </div>
                </div>
              </td>
              <td className="text-center text-[16px] font-bold text-black font-open">
                {product.brand || 'N/A'}
              </td>
              <td className="text-center text-[16px] text-black font-open">
                {product.sku || product.id}
              </td>
              <td className="text-center text-[16px] font-open">
                <span
                  className={cn(
                    product.rating < 3.5 ? 'text-[#f11010]' : 'text-black',
                  )}
                >
                  {product.rating}
                </span>
                <span className="text-black">/5</span>
              </td>
              <td className="text-center text-[16px] font-mono text-[#222]">
                {Math.floor(product.price).toLocaleString('ru-RU')}
                <span className="text-grey-medium">,00</span>
              </td>
              <td className="px-[18px]">
                <div className="flex items-center justify-center gap-[32px]">
                  <button
                    type="button"
                    aria-label="Добавить"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('not implemented');
                    }}
                    className="bg-primary p-[4px] rounded-[23px] flex items-center justify-center w-[52px] h-[27px] cursor-pointer border-0 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <Plus className="text-white w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="Действия"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('not implemented');
                    }}
                    className="p-0 border-0 bg-transparent cursor-pointer rounded hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <CircleEllipsis className="w-8 h-8 text-grey-medium" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

