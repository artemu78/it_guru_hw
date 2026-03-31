import { useEffect, useState } from 'react';
import { 
  Search, 
  RefreshCcw, 
  CirclePlus, 
  ListFilter, 
  CircleEllipsis, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import AddProductModal from '../components/AddProductModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    fetchProducts, 
    search, 
    setSearch, 
    setSort, 
    sortBy, 
    total 
  } = useProductStore();
  
  const logout = useAuthStore(state => state.logout);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col items-center">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      <div className="w-full max-w-[1920px] px-[30px] py-[20px] flex flex-col gap-[30px]">
        {/* Header */}
        <header className="bg-white h-[105px] rounded-[10px] px-[30px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-8">
            <h1 className="text-[24px] font-bold text-[#202020] font-cairo">Товары</h1>
            <button 
              onClick={logout}
              className="text-sm text-grey-dark hover:text-primary transition-colors bg-transparent p-0 border-none"
            >
              Выйти
            </button>
          </div>
          
          <div className="flex-1 max-w-[1023px] flex items-center justify-center">
            <div className="bg-[#f3f3f3] rounded-[8px] px-[20px] py-[12px] flex items-center gap-[8px] w-full">
              <Search className="w-6 h-6 text-grey-medium" />
              <input 
                type="text" 
                placeholder="Найти"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-[14px] text-[#232323] placeholder-[#999]"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="bg-white rounded-[12px] p-[30px] shadow-sm flex flex-col gap-[40px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#333] font-cairo">Все позиции</h2>
            
            <div className="flex items-center gap-[8px]">
              <button 
                onClick={() => fetchProducts()}
                className="p-[10px] rounded-[8px] border border-[#ececeb] bg-white hover:bg-grey-light transition-colors"
              >
                <RefreshCcw className={cn("w-[22px] h-[22px] text-grey-medium", loading && "animate-spin")} />
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-[#ebf3ea] px-[20px] py-[10px] rounded-[6px] flex items-center gap-[15px] font-semibold text-[14px] font-cairo hover:bg-[#1d26c0] transition-colors"
              >
                <CirclePlus className="w-[22px] h-[22px]" />
                Добавить
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative overflow-x-auto">
            {/* Progress Bar */}
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
                      <div className="w-[22px] h-[22px] border border-grey-medium rounded-[4px]" />
                      <span>Наименование</span>
                    </div>
                  </th>
                  <th className="text-center w-[125px]">Вендор</th>
                  <th className="text-center w-[125px]">Артикул</th>
                  <th className="text-center w-[125px]">
                    <button 
                      onClick={() => setSort('rating')}
                      className="flex items-center justify-center gap-2 w-full bg-transparent hover:text-primary transition-colors p-0"
                    >
                      Оценка
                      <ListFilter className={cn("w-4 h-4", sortBy === 'rating' && "text-primary")} />
                    </button>
                  </th>
                  <th className="text-center w-[125px]">
                    <button 
                      onClick={() => setSort('price')}
                      className="flex items-center justify-center gap-2 w-full bg-transparent hover:text-primary transition-colors p-0"
                    >
                      Цена, ₽
                      <ListFilter className={cn("w-4 h-4", sortBy === 'price' && "text-primary")} />
                    </button>
                  </th>
                  <th className="w-[133px]"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="h-[71px] border-b border-[#e2e2e2] hover:bg-grey-light/20 transition-colors">
                    <td className="px-[18px]">
                      <div className="flex items-center gap-[18px]">
                        <div className="w-[22px] h-[22px] border border-grey-medium rounded-[4px]" />
                        <div className="w-[48px] h-[48px] bg-[#c4c4c4] rounded-[8px] overflow-hidden">
                           <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[16px] font-bold text-[#161919] font-cairo line-clamp-1">{product.title}</span>
                          <span className="text-[14px] text-grey-medium font-cairo">{product.category}</span>
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
                      <span className={cn(product.rating < 3.5 ? "text-[#f11010]" : "text-black")}>
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
                          <div className="bg-primary p-[4px] rounded-[23px] flex items-center justify-center w-[52px] h-[27px] cursor-pointer">
                             <Plus className="text-white w-6 h-6" />
                          </div>
                          <CircleEllipsis className="w-8 h-8 text-grey-medium cursor-pointer" />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between py-[11px]">
            <p className="text-[18px] text-[#969b9f]">
              Показано <span className="text-[#333]">1-{products.length}</span> из <span className="text-[#333]">{total}</span>
            </p>
            
            <div className="flex items-center gap-[16px]">
              <ChevronLeft className="w-5 h-5 text-grey-medium cursor-pointer" />
              <div className="flex items-center gap-[8px]">
                {[1, 2, 3, 4, 5].map(page => (
                  <div 
                    key={page}
                    className={cn(
                      "w-[30px] h-[30px] rounded-[4px] flex items-center justify-center text-[14px] cursor-pointer transition-all",
                      page === 1 
                        ? "bg-[#797fea] text-white shadow-lg" 
                        : "border border-[#ececeb] text-grey-medium"
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
      </div>

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
    </div>
  );
}
