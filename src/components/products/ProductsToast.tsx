interface ProductsToastProps {
  toast: string | null;
}

export default function ProductsToast({ toast }: ProductsToastProps) {
  if (!toast) return null;
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-4">
      {toast}
    </div>
  );
}

