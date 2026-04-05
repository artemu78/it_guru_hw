import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useProductStore } from '../store/productStore';
import AddProductModal from './AddProductModal';
import ProductsToast from './products/ProductsToast';
import ProductsPageActions from './products/ProductsPageActions';
import { ProductsMobileList } from './products/ProductsMobileList';
import { ProductsDesktopTable } from './products/ProductsDesktopTable';
import { ProductsPagination } from './products/ProductsPagination';

export default function ProductsPageBody() {
  const {
    products,
    loading,
    fetchProducts,
    setSort,
    sortBy,
    total,
    order,
  } = useProductStore(
    useShallow((s) => ({
      products: s.products,
      loading: s.loading,
      fetchProducts: s.fetchProducts,
      setSort: s.setSort,
      sortBy: s.sortBy,
      total: s.total,
      order: s.order,
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
      <ProductsToast toast={toast} />

      <main className="bg-white rounded-[12px] p-4 sm:p-[30px] shadow-sm flex flex-col gap-6 sm:gap-[40px]">
        <ProductsPageActions
          loading={loading}
          total={total}
          productsCount={products.length}
          sortBy={sortBy}
          order={order}
          onRefresh={fetchProducts}
          onOpenAddModal={() => setIsModalOpen(true)}
          onSort={setSort}
        />

        <ProductsMobileList
          products={products}
          selectedIds={selectedIds}
          onToggleRowSelection={toggleRowSelection}
        />

        <ProductsDesktopTable
          products={products}
          loading={loading}
          sortBy={sortBy}
          selectedIds={selectedIds}
          allSelected={allSelected}
          onToggleRowSelection={toggleRowSelection}
          onToggleSelectAll={toggleSelectAll}
          onSort={setSort}
        />

        <ProductsPagination shownFrom={1} shownTo={products.length} total={total} />
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
