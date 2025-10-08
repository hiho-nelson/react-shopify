interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="pt-2 md:pt-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-none hover:bg-gray-50 cursor-pointer"
        >
          -
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-none hover:bg-gray-50 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}


