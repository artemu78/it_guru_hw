import { useEffect, useRef, useState } from 'react';
import { Search, User } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';

const SEARCH_DEBOUNCE_MS = 300;

export default function ProductsPageHeader() {
  const setSearch = useProductStore((s) => s.setSearch);
  const logout = useAuthStore((state) => state.logout);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    () => useProductStore.getState().search,
  );
  const skipNextDebounceRef = useRef(true);

  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      setSearch(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput, setSearch]);

  return (
    <header className="relative bg-white rounded-[10px] px-4 py-4 sm:px-[30px] sm:h-[105px] flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm gap-4">
      <div className="flex items-center justify-between gap-3 sm:w-[200px] sm:shrink-0">
        <h1 className="text-[24px] font-bold text-[#202020] font-cairo">Товары</h1>

        <button
          type="button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-[48px] h-[48px] rounded-full bg-grey-light flex items-center justify-center hover:bg-grey-medium transition-colors border-none p-0 cursor-pointer sm:hidden"
        >
          <User className="w-6 h-6 text-grey-dark" />
        </button>
      </div>

      <div className="w-full flex items-center justify-center sm:flex-1 sm:max-w-[1023px]">
        <div className="bg-[#f3f3f3] rounded-[8px] px-[16px] sm:px-[20px] py-[12px] flex items-center gap-[8px] w-full">
          <Search className="w-6 h-6 text-grey-medium shrink-0" />
          <input
            type="text"
            placeholder="Найти"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent border-none outline-none min-w-0 flex-1 text-[14px] text-[#232323] placeholder-[#999]"
          />
        </div>
      </div>

      <div className="relative shrink-0 hidden sm:flex items-center justify-end w-[200px]">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-[48px] h-[48px] rounded-full bg-grey-light flex items-center justify-center hover:bg-grey-medium transition-colors border-none p-0 cursor-pointer"
        >
          <User className="w-6 h-6 text-grey-dark" />
        </button>
      </div>

      {isUserMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsUserMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute top-[72px] right-4 sm:top-[55px] sm:right-[30px] w-48 bg-white rounded-md shadow-lg py-1 border border-grey-light z-50 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-[#f11010] hover:bg-grey-light transition-colors border-none bg-transparent cursor-pointer font-medium"
            >
              Выйти
            </button>
          </div>
        </>
      )}
    </header>
  );
}
