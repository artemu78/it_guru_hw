import { useForm } from 'react-hook-form';
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

export default function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const addProduct = useProductStore((state) => state.addProduct);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-light">
          <h2 className="text-xl font-bold text-[#333]">Добавить товар</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-grey-light rounded-full transition-colors bg-transparent border-none"
          >
            <X className="w-6 h-6 text-grey-medium" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 flex flex-col gap-4"> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-grey-dark">Наименование</label>
            <input
              {...register('title')}
              className="bg-[#f3f3f3] border-none rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Введите наименование"
            />
            {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-grey-dark">Цена, ₽</label>
            <input
              {...register('price')}
              type="number"
              className="bg-[#f3f3f3] border-none rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0"
            />
            {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-grey-dark">Вендор</label>
            <input
              {...register('vendor')}
              className="bg-[#f3f3f3] border-none rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Введите вендора"
            />
            {errors.vendor && <span className="text-red-500 text-xs">{errors.vendor.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-grey-dark">Артикул</label>
            <input
              {...register('sku')}
              className="bg-[#f3f3f3] border-none rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Введите артикул"
            />
            {errors.sku && <span className="text-red-500 text-xs">{errors.sku.message}</span>}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-grey-light rounded-lg text-grey-dark hover:bg-grey-light transition-colors font-semibold bg-transparent"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#1d26c0] transition-colors font-semibold"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
