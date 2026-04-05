import { CircleEllipsis, Plus, Square, CheckSquare } from 'lucide-react';
import type { IProduct } from '../../types/IProduct';
import { cn } from '../../lib/cn';

interface ProductsMobileListProps {
  products: IProduct[];
  selectedIds: ReadonlySet<number>;
  onToggleRowSelection: (id: number) => void;
}

export function ProductsMobileList({
  products,
  selectedIds,
  onToggleRowSelection,
}: ProductsMobileListProps) {
  return (
    <div className="sm:hidden">
      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const selected = selectedIds.has(product.id);
          return (
            <div
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
              className={cn(
                'rounded-[12px] border border-[#ececeb] bg-white p-4 transition-[background-color,border-color] cursor-pointer',
                'hover:bg-grey-light/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-[2px] shrink-0">
                  {selected ? (
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
                </div>

                <div className="w-[56px] h-[56px] bg-[#c4c4c4] rounded-[10px] overflow-hidden shrink-0">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-[#161919] font-cairo line-clamp-2">
                        {product.title}
                      </div>
                      <div className="text-[13px] text-grey-medium font-cairo">
                        {product.category}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[15px] font-mono text-[#222]">
                        {Math.floor(product.price).toLocaleString('ru-RU')}
                        <span className="text-grey-medium">,00</span>
                      </div>
                      <div className="text-[13px] font-open">
                        <span
                          className={cn(
                            product.rating < 3.5 ? 'text-[#f11010]' : 'text-black',
                          )}
                        >
                          {product.rating}
                        </span>
                        <span className="text-black">/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-grey-medium">
                        Вендор
                      </div>
                      <div className="text-[13px] font-bold text-black font-open">
                        {product.brand || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-grey-medium">
                        Артикул
                      </div>
                      <div className="text-[13px] text-black font-open">
                        {product.sku || product.id}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      aria-label="Добавить"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('not implemented');
                      }}
                      className="bg-primary p-[4px] rounded-[23px] flex items-center justify-center w-[52px] h-[30px] cursor-pointer border-0 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

