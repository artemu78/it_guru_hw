import { useEffect, useRef, useState } from 'react';
import {
  RefreshCcw,
  CirclePlus,
  ListFilter,
  CircleEllipsis,
  Plus,
  ChevronLeft,
  ChevronRight,
  Square,
  CheckSquare,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useShallow } from 'zustand/react/shallow';
import { useProductStore } from '../store/productStore';
import AddProductModal from './AddProductModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProductsPageBody() {
  const {
    products,
    loading,
    fetchProducts,
    setSort,
    sortBy,
    total,
  } = useProductStore(
    useShallow((s) => ({
      products: s.products,
      loading: s.loading,
      fetchProducts: s.fetchProducts,
      setSort: s.setSort,
      sortBy: s.sortBy,
      total: s.total,
    })),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleRowSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected =
    products.length > 0 && selectedIds.size === products.length;

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (products.length > 0 && prev.size === products.length) {
        return new Set();
      }
      return new Set(products.map((p) => p.id));
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      <main className="bg-white rounded-[12px] p-[30px] shadow-sm flex flex-col gap-[40px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#333] font-cairo">Все позиции</h2>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => fetchProducts()}
              className="p-[10px] rounded-[8px] border border-[#ececeb] bg-white hover:bg-grey-light transition-colors"
            >
              <RefreshCcw
                className={cn(
                  'w-[22px] h-[22px] text-grey-medium',
                  loading && 'animate-spin',
                )}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-[#ebf3ea] px-[20px] py-[10px] rounded-[6px] flex items-center gap-[15px] font-semibold text-[14px] font-cairo hover:bg-[#1d26c0] transition-colors"
            >
              <CirclePlus className="w-[22px] h-[22px]" />
              Добавить
            </button>
          </div>
        </div>

        <div className="relative overflow-x-auto">
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
                      onClick={toggleSelectAll}
                      className="inline-flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer rounded shrink-0 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                      aria-pressed={allSelected}
                      aria-label={
                        allSelected
                          ? 'Снять выделение со всех'
                          : 'Выделить все'
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
                    onClick={() => setSort('rating')}
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
                    onClick={() => setSort('price')}
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
                  onClick={() => toggleRowSelection(product.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleRowSelection(product.id);
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

        <div className="flex items-center justify-between py-[11px]">
          <p className="text-[18px] text-[#969b9f]">
            Показано{' '}
            <span className="text-[#333]">
              1-{products.length}
            </span>{' '}
            из <span className="text-[#333]">{total}</span>
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
      </main>

      {isModalOpen && (
        <AddProductModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => showToast('Товар успешно добавлен')}
        />
      )}

      <style>{`
        @keyframes progress-indeterminate {
          0% { left: -30%; }
          100% { left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
          position: absolute;
        }
      `}</style>
    </>
  );
}
