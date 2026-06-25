"use client";

import { useMemo, useRef, useState } from "react";
import { createCollectible } from "./actions";

type Category = { id: number; name: string; icon: string | null };
type Subtype = { id: number; name: string; category_id: number };
type Brand = { id: number; name: string };
type Franchise = { id: number; name: string };

type Character = {
  id: number;
  name: string;
  franchise_id: number | null;
  notes: string | null;
};

type Series = {
  id: number;
  name: string;
  franchise_id: number;
  format: string;
  total_units: number | null;
};

type Lot = {
  id: number;
  name: string | null;
};

type Props = {
  categories: Category[];
  subtypes: Subtype[];
  brands: Brand[];
  franchises: Franchise[];
  characters: Character[];
  series: Series[];
  lots: Lot[];
};

const NEW_VALUE = "__new__";

export default function NewCollectibleForm({
  categories,
  subtypes,
  brands,
  franchises,
  characters,
  series,
  lots,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [categoryValue, setCategoryValue] = useState("");
  const [subtypeValue, setSubtypeValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [franchiseValue, setFranchiseValue] = useState("");
  const [characterValue, setCharacterValue] = useState("");
  const [seriesValue, setSeriesValue] = useState("");

  const [createEdition, setCreateEdition] = useState(false);
  const [createPurchase, setCreatePurchase] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  const sortedFranchises = [...franchises].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const sortedLots = [...lots].sort((a, b) =>
    (a.name || `Lot ${a.id}`).localeCompare(b.name || `Lot ${b.id}`)
  );

  const filteredSubtypes = useMemo(() => {
    if (!categoryValue || categoryValue === NEW_VALUE) {
      return [...subtypes].sort((a, b) => a.name.localeCompare(b.name));
    }

    return subtypes
      .filter((subtype) => subtype.category_id === Number(categoryValue))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [subtypes, categoryValue]);

  const filteredCharacters = useMemo(() => {
    if (!franchiseValue || franchiseValue === NEW_VALUE) {
      return [...characters].sort((a, b) => a.name.localeCompare(b.name));
    }

    return characters
      .filter((character) => character.franchise_id === Number(franchiseValue))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [characters, franchiseValue]);

  const filteredSeries = useMemo(() => {
    if (!franchiseValue || franchiseValue === NEW_VALUE) {
      return [...series].sort((a, b) => a.name.localeCompare(b.name));
    }

    return series
      .filter((item) => item.franchise_id === Number(franchiseValue))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [series, franchiseValue]);

  function handleFiles(files: FileList | File[]) {
    const selected = Array.from(files);
    setFileNames(selected.map((file) => file.name));
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await createCollectible(formData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <Card title="Collectible Details">
        <div className="space-y-5">
          <Select name="status" label="Collection Status" required>
            <option value="OWNED">Owned</option>
            <option value="PLANNED">Planned</option>
            <option value="WISHLIST">Wishlist</option>
          </Select>

          <Input
            name="custom_title"
            label="Custom Title Optional"
            placeholder="Leave blank to auto-generate title"
          />

          <Textarea name="description" label="Description Optional" />

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Images Optional
            </label>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);

                if (!inputRef.current) return;

                inputRef.current.files = e.dataTransfer.files;
                handleFiles(e.dataTransfer.files);
              }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-12 text-center transition ${
                dragActive
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-white/15 bg-black"
              }`}
            >
              <input
                ref={inputRef}
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files || [])}
                className="hidden"
              />

              <span className="text-sm font-medium text-white">
                Drag & drop images here
              </span>

              <span className="mt-2 text-sm text-gray-500">
                or click to choose multiple files
              </span>

              {fileNames.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {fileNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-cyan-400/30 px-4 py-2 text-xs text-cyan-300"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </label>
          </div>
        </div>
      </Card>

      <Card title="Category">
        <Select
          name="category_id"
          label="Category"
          value={categoryValue}
          onChange={(value) => {
            setCategoryValue(value);
            setSubtypeValue("");
          }}
          required
        >
          <option value="">Select category</option>
          <option value={NEW_VALUE}>+ New Category</option>
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        {categoryValue === NEW_VALUE && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input name="new_category_name" label="Category Name" required />
            <Input name="new_category_icon" label="Category Icon Optional" />
          </div>
        )}
      </Card>

      <Card title="Subtype">
        <Select
          name="subtype_id"
          label="Subtype"
          value={subtypeValue}
          onChange={setSubtypeValue}
          required
        >
          <option value="">Select subtype</option>
          <option value={NEW_VALUE}>+ New Subtype</option>
          {filteredSubtypes.map((subtype) => (
            <option key={subtype.id} value={subtype.id}>
              {subtype.name}
            </option>
          ))}
        </Select>

        {subtypeValue === NEW_VALUE && (
          <div className="mt-5">
            <Input name="new_subtype_name" label="Subtype Name" required />
          </div>
        )}
      </Card>

      <Card title="Brand">
        <Select
          name="brand_id"
          label="Brand"
          value={brandValue}
          onChange={setBrandValue}
        >
          <option value="">No brand</option>
          <option value={NEW_VALUE}>+ New Brand</option>
          {sortedBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>

        {brandValue === NEW_VALUE && (
          <div className="mt-5">
            <Input name="new_brand_name" label="Brand Name" required />
          </div>
        )}
      </Card>

      <Card title="Franchise">
        <Select
          name="franchise_id"
          label="Franchise"
          value={franchiseValue}
          onChange={(value) => {
            setFranchiseValue(value);
            setSeriesValue("");
            setCharacterValue("");
          }}
        >
          <option value="">No franchise</option>
          <option value={NEW_VALUE}>+ New Franchise</option>
          {sortedFranchises.map((franchise) => (
            <option key={franchise.id} value={franchise.id}>
              {franchise.name}
            </option>
          ))}
        </Select>

        {franchiseValue === NEW_VALUE && (
          <div className="mt-5">
            <Input name="new_franchise_name" label="Franchise Name" required />
          </div>
        )}
      </Card>

      <Card title="Character">
        <Select
          name="character_id"
          label="Character"
          value={characterValue}
          onChange={setCharacterValue}
        >
          <option value="">No character</option>
          <option value={NEW_VALUE}>+ New Character</option>
          {filteredCharacters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
        </Select>

        {characterValue === NEW_VALUE && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input name="new_character_name" label="Character Name" required />
            <Textarea
              name="new_character_notes"
              label="Character Notes Optional"
            />

            <Select
              name="new_character_reference_type"
              label="Reference Type Optional"
            >
              <option value="WIKIPEDIA">Wikipedia</option>
              <option value="OFFICIAL">Official</option>
              <option value="FANDOM">Fandom</option>
              <option value="OTHER">Other</option>
            </Select>

            <Input
              name="new_character_reference_url"
              label="Reference URL Optional"
              type="url"
              placeholder="https://..."
            />

            <Input
              name="new_character_reference_label"
              label="Reference Label Optional"
              placeholder="Example: Official Bio"
            />
          </div>
        )}
      </Card>

      <Card title="Series">
        <Select
          name="series_id"
          label="Series"
          value={seriesValue}
          onChange={setSeriesValue}
        >
          <option value="">No series</option>
          <option value={NEW_VALUE}>+ New Series</option>
          {filteredSeries.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.total_units ? ` (${item.total_units} items)` : ""}
            </option>
          ))}
        </Select>

        <div className="mt-5">
          <Input
            name="series_number"
            label="Item Number In Series Optional"
            type="number"
            placeholder="Example: Kiriko = 1, Mercy = 2, Genji = 10"
          />
        </div>

        {seriesValue === NEW_VALUE && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input name="new_series_name" label="Series Name" required />

            <Select name="new_series_format" label="Series Format" required>
              <option value="GAME">Game</option>
              <option value="ANIME">Anime</option>
              <option value="MANGA">Manga</option>
              <option value="FILM">Film</option>
              <option value="MUSIC">Music</option>
              <option value="OTHER">Other</option>
            </Select>

            <Input
              name="new_series_total_units"
              label="Total Items In Series Optional"
              type="number"
              placeholder="Example: 12"
            />

            <Textarea name="new_series_notes" label="Notes Optional" />
          </div>
        )}
      </Card>

      <Card title="Edition Optional">
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            name="create_edition"
            checked={createEdition}
            onChange={(e) => setCreateEdition(e.target.checked)}
          />
          Add edition / variant data
        </label>

        {createEdition && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input
              name="edition_number"
              label="Edition Number Optional"
              type="number"
            />
            <Input name="edition_name" label="Edition Name Optional" />
            <Input name="exclusive_label" label="Exclusive Label Optional" />
            <Input
              name="release_date"
              label="Release Date Optional"
              type="date"
            />
            <Input
              name="edition_size"
              label="Edition Size Optional"
              type="number"
            />
            <Input name="sku" label="SKU Optional" />
          </div>
        )}
      </Card>

      <Card title="Purchase Optional">
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            name="create_purchase"
            checked={createPurchase}
            onChange={(e) => setCreatePurchase(e.target.checked)}
          />
          Add owned purchase data
        </label>

        {createPurchase && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Select name="condition" label="Condition" required>
              <option value="MINT">Mint</option>
              <option value="NEAR_MINT">Near Mint</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
              <option value="DAMAGED">Damaged</option>
            </Select>

            <Select name="purchase_status" label="Purchase Status" required>
              <option value="OWNED">Owned</option>
              <option value="SOLD">Sold</option>
              <option value="GIFTED">Gifted</option>
            </Select>

            <Input
              name="purchased_at"
              label="Purchased At"
              type="date"
              required
            />
            <Input name="store_name" label="Store Name Optional" />
            <Input name="receipt_url" label="Receipt URL Optional" />
            <Input
              name="purchase_price"
              label="Purchase Price Optional"
              type="number"
            />
            <Input name="tax_amount" label="Tax Amount Optional" type="number" />
            <Input
              name="shipping_cost"
              label="Shipping Cost Optional"
              type="number"
            />
            <Input name="total_cost" label="Total Cost Optional" type="number" />
            <Input name="resale_date" label="Resale Date Optional" type="date" />
            <Input
              name="resale_price"
              label="Resale Price Optional"
              type="number"
            />

            <Select name="lot_id" label="Lot Optional">
              <option value="">No lot</option>
              <option value={NEW_VALUE}>+ New Lot</option>
              {sortedLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name || `Lot ${lot.id}`}
                </option>
              ))}
            </Select>

            <Input name="new_lot_name" label="New Lot Name Optional" />
            <Input name="serial_number" label="Serial Number Optional" />
            <Input name="location" label="Location Optional" />
            <Textarea name="purchase_notes" label="Purchase Notes Optional" />
          </div>
        )}
      </Card>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-cyan-400 px-6 py-4 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-6 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
      />
    </div>
  );
}

function Textarea({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
      />
    </div>
  );
}

function Select({
  name,
  label,
  value,
  onChange,
  required = false,
  children,
}: {
  name: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">{label}</label>
      <select
        name={name}
        value={value}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
      >
        {children}
      </select>
    </div>
  );
}