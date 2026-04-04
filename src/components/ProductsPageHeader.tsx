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
    <header className="bg-white h-[105px] rounded-[10px] px-[30px] flex items-center justify-between shadow-sm gap-4">
      <div className="flex items-center shrink-0 w-[200px]">
        <h1 className="text-[24px] font-bold text-[#202020] font-cairo">Товары</h1>
      </div>

      <div className="flex-1 max-w-[1023px] flex items-center justify-center">
        <div className="bg-[#f3f3f3] rounded-[8px] px-[20px] py-[12px] flex items-center gap-[8px] w-full">
          <Search className="w-6 h-6 text-grey-medium" />
          <input
            type="text"
            placeholder="Найти"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-[14px] text-[#232323] placeholder-[#999]"
          />
        </div>
      </div>

      <div className="relative shrink-0 flex items-center justify-end w-[200px]">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-[48px] h-[48px] rounded-full bg-grey-light flex items-center justify-center hover:bg-grey-medium transition-colors border-none p-0 cursor-pointer"
        >
          <User className="w-6 h-6 text-grey-dark" />
        </button>

        {isUserMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsUserMenuOpen(false)}
              aria-hidden
            />
            <div className="absolute top-[55px] right-0 w-48 bg-white rounded-md shadow-lg py-1 border border-grey-light z-50 animate-in fade-in zoom-in-95 duration-200">
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
      </div>
    </header>
  );
}
