import { Select } from "@/components/ui/select";

interface ProductVariantSelectorProps {
  optionNames: string[];
  optionValuesByName: Map<string, string[]>;
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
  selectedVariant: {
    availableForSale: boolean;
  } | null;
}

export function ProductVariantSelector({
  optionNames,
  optionValuesByName,
  selectedOptions,
  onOptionChange,
  selectedVariant,
}: ProductVariantSelectorProps) {
  return (
    <div className="pt-2 md:pt-3">
      <div className="flex flex-col gap-3">
        {optionNames.map((name) => {
          const values = optionValuesByName.get(name) || [];
          return (
            <div key={name} className="flex">
              <div className="w-full md:w-2/3">
                <Select
                  ariaLabel={name}
                  value={selectedOptions[name] || values[0] || ""}
                  onValueChange={(val) => onOptionChange(name, val)}
                  options={values.map((v) => ({
                    value: v,
                    label: v,
                  }))}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {selectedVariant?.availableForSale ? "Available" : "Out of Stock"}
      </div>
    </div>
  );
}


