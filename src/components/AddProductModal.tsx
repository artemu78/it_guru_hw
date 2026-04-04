import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { useProductStore } from '../store/productStore';

const productSchema = z.object({
  title: z.string().min(1, 'Наименование обязательно'),
  price: z.coerce.number().min(0, 'Цена должна быть положительной'),
  vendor: z.string().min(1, 'Вендор обязателен'),
  sku: z.string().min(1, 'Артикул обязателен'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/** Stitch export: bg-inputBg, focus:border-primary (#2F3AE3), focus:ring-0 */
const inputDefault =
  'w-full rounded-xl border border-transparent bg-[#F3F4F6] px-4 py-3 text-[15px] text-gray-700 outline-none transition-[border-color] placeholder:text-gray-400 focus:border-[#2F3AE3] focus:ring-0';

/** SKU: Stitch static “active” border + indigo focus */
const inputSku =
  'w-full rounded-xl border-2 border-[#D1D5FF] bg-[#F3F4F6] px-4 py-3 text-[15px] text-gray-700 outline-none transition-[border-color] placeholder:text-gray-400 focus:border-[#A5B4FC] focus:ring-0';

export default function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const addProduct = useProductStore((state) => state.addProduct);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
  });

  const onSubmit = (data: ProductFormData) => {
    addProduct({
      ...data,
      description: '',
      discountPercentage: 0,
      rating: 5,
      stock: 100,
      brand: data.vendor,
      category: 'New',
      thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
      images: [],
    });
    onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-modal-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <header className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
          <h2
            id="add-product-modal-title"
            className="flex items-center gap-2 text-2xl font-bold text-gray-800 font-inter"
          >
            Добавить товар
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AE3]"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
          <div className="space-y-2">
            <label htmlFor="add-product-title" className="block text-sm font-medium text-gray-500">
              Наименование
            </label>
            <input
              id="add-product-title"
              {...register('title')}
              className={inputDefault}
              placeholder="Введите наименование"
              autoComplete="off"
            />
            {errors.title && (
              <span className="text-[13px] text-[#f11010]">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="add-product-price" className="block text-sm font-medium text-gray-500">
              Цена, ₽
            </label>
            <input
              id="add-product-price"
              {...register('price')}
              type="number"
              min={0}
              step="any"
              className={inputDefault}
              placeholder="0"
            />
            {errors.price && (
              <span className="text-[13px] text-[#f11010]">{errors.price.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="add-product-vendor" className="block text-sm font-medium text-gray-500">
              Вендор
            </label>
            <input
              id="add-product-vendor"
              {...register('vendor')}
              className={inputDefault}
              placeholder="Введите вендора"
              autoComplete="off"
            />
            {errors.vendor && (
              <span className="text-[13px] text-[#f11010]">{errors.vendor.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="add-product-sku" className="block text-sm font-medium text-gray-500">
              Артикул
            </label>
            <input
              id="add-product-sku"
              {...register('sku')}
              className={inputSku}
              placeholder="Введите артикул"
              autoComplete="off"
            />
            {errors.sku && <span className="text-[13px] text-[#f11010]">{errors.sku.message}</span>}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-4 text-[15px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AE3]"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#2F3AE3] py-4 text-[15px] font-semibold text-white shadow-lg shadow-blue-200 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F3AE3]"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
