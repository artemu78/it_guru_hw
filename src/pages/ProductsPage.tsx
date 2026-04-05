import ProductsPageHeader from '../components/ProductsPageHeader';
import ProductsPageBody from '../components/ProductsPageBody';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col items-center">
      <div className="w-full max-w-[1920px] px-4 py-4 sm:px-[30px] sm:py-[20px] flex flex-col gap-4 sm:gap-[30px]">
        <ProductsPageHeader />
        <ProductsPageBody />
      </div>
    </div>
  );
}
