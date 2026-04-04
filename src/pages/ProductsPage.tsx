import ProductsPageHeader from '../components/ProductsPageHeader';
import ProductsPageBody from '../components/ProductsPageBody';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col items-center">
      <div className="w-full max-w-[1920px] px-[30px] py-[20px] flex flex-col gap-[30px]">
        <ProductsPageHeader />
        <ProductsPageBody />
      </div>
    </div>
  );
}
