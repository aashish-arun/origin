"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { bulkCreateSeriesItems } from "./actions";

const NEW_VALUE = "__new__";

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

type Props = {
  categories: Category[];
  subtypes: Subtype[];
  brands: Brand[];
  franchises: Franchise[];
  characters: Character[];
  series: Series[];
};

type DraftItem = {
  localId: string;
  seriesNumber: string;
  characterId: string;
  newCharacterName: string;
  newCharacterNotes: string;
  newCharacterReferenceType: "WIKIPEDIA" | "OFFICIAL" | "FANDOM" | "OTHER";
  newCharacterReferenceUrl: string;
  newCharacterReferenceLabel: string;
  status: "OWNED" | "PLANNED" | "WISHLIST";
  customTitle: string;
  description: string;
  fileNames: string[];
};

function createDraftItem(nextNumber: number): DraftItem {
  return {
    localId: crypto.randomUUID(),
    seriesNumber: String(nextNumber),
    characterId: "",
    newCharacterName: "",
    newCharacterNotes: "",
    newCharacterReferenceType: "OTHER",
    newCharacterReferenceUrl: "",
    newCharacterReferenceLabel: "",
    status: "PLANNED",
    customTitle: "",
    description: "",
    fileNames: [],
  };
}

function getMissingNumbers(value: string | null) {
  if (!value) return [];

  return value
    .split(",")
    .map((number) => Number(number.trim()))
    .filter((number) => Number.isFinite(number) && number > 0);
}

export default function BulkSeriesForm({
  categories,
  subtypes,
  brands,
  franchises,
  characters,
  series,
}: Props) {
  const searchParams = useSearchParams();

  const prefillFranchiseId = searchParams.get("franchise_id") || "";
  const prefillSeriesId = searchParams.get("series_id") || "";
  const prefillCategoryId = searchParams.get("category_id") || "";
  const prefillSubtypeId = searchParams.get("subtype_id") || "";
  const prefillBrandId = searchParams.get("brand_id") || "";
  const prefillMissingNumbers = getMissingNumbers(
    searchParams.get("missing_numbers")
  );

  const [categoryId, setCategoryId] = useState(prefillCategoryId);
  const [subtypeId, setSubtypeId] = useState(prefillSubtypeId);
  const [brandId, setBrandId] = useState(prefillBrandId);
  const [franchiseId, setFranchiseId] = useState(prefillFranchiseId);
  const [seriesId, setSeriesId] = useState(prefillSeriesId);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DraftItem[]>(
    prefillMissingNumbers.length > 0
      ? prefillMissingNumbers.map((number) => createDraftItem(number))
      : [createDraftItem(1)]
  );

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  const sortedFranchises = [...franchises].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const selectedSeries = series.find((item) => item.id === Number(seriesId));
  const totalUnits = selectedSeries?.total_units || null;

  const filteredSubtypes = useMemo(() => {
    if (!categoryId || categoryId === NEW_VALUE) {
      return [...subtypes].sort((a, b) => a.name.localeCompare(b.name));
    }

    return subtypes
      .filter((item) => item.category_id === Number(categoryId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [subtypes, categoryId]);

  const filteredSeries = useMemo(() => {
    if (!franchiseId) {
      return [...series].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (franchiseId === NEW_VALUE) return [];

    return series
      .filter((item) => item.franchise_id === Number(franchiseId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [series, franchiseId]);

  const filteredCharacters = useMemo(() => {
    if (!franchiseId) {
      return [...characters].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (franchiseId === NEW_VALUE) return [];

    return characters
      .filter((character) => character.franchise_id === Number(franchiseId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [characters, franchiseId]);

  function updateItem(localId: string, patch: Partial<DraftItem>) {
    setItems((current) =>
      current.map((item) =>
        item.localId === localId ? { ...item, ...patch } : item
      )
    );
  }

  function addItem() {
    const usedNumbers = items
      .map((item) => Number(item.seriesNumber))
      .filter((value) => Number.isFinite(value) && value > 0);

    let nextNumber = 1;

    while (usedNumbers.includes(nextNumber)) {
      nextNumber += 1;
    }

    if (totalUnits && nextNumber > totalUnits) {
      alert(`This series only has ${totalUnits} total items.`);
      return;
    }

    setItems((current) => [...current, createDraftItem(nextNumber)]);
  }

  function removeItem(localId: string) {
    setItems((current) => current.filter((item) => item.localId !== localId));
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await bulkCreateSeriesItems(formData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <input type="hidden" name="item_count" value={items.length} />

      <Card title="Series Setup">
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            name="franchise_id"
            label="Franchise"
            value={franchiseId}
            onChange={(value) => {
              setFranchiseId(value);
              setSeriesId("");
              setItems((current) =>
                current.map((item) => ({
                  ...item,
                  characterId: "",
                  newCharacterName: "",
                  newCharacterNotes: "",
                  newCharacterReferenceType: "OTHER",
                  newCharacterReferenceUrl: "",
                  newCharacterReferenceLabel: "",
                }))
              );
            }}
            required
          >
            <option value="">Select franchise</option>
            <option value={NEW_VALUE}>+ New Franchise</option>
            {sortedFranchises.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>

          <Select
            name="series_id"
            label="Series"
            value={seriesId}
            onChange={setSeriesId}
            required
          >
            <option value="">Select series</option>
            <option value={NEW_VALUE}>+ New Series</option>
            {filteredSeries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.total_units ? ` (${item.total_units} items)` : ""}
              </option>
            ))}
          </Select>

          {franchiseId === NEW_VALUE && (
            <Input name="new_franchise_name" label="Franchise Name" required />
          )}

          {seriesId === NEW_VALUE && (
            <>
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
            </>
          )}

          <Select
            name="brand_id"
            label="Default Brand"
            value={brandId}
            onChange={setBrandId}
          >
            <option value="">No brand</option>
            <option value={NEW_VALUE}>+ New Brand</option>
            {sortedBrands.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>

          <Select
            name="category_id"
            label="Default Category"
            value={categoryId}
            onChange={(value) => {
              setCategoryId(value);
              setSubtypeId("");
            }}
            required
          >
            <option value="">Select category</option>
            <option value={NEW_VALUE}>+ New Category</option>
            {sortedCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>

          {brandId === NEW_VALUE && (
            <Input name="new_brand_name" label="Brand Name" required />
          )}

          {categoryId === NEW_VALUE && (
            <>
              <Input name="new_category_name" label="Category Name" required />
              <Input name="new_category_icon" label="Category Icon Optional" />
            </>
          )}

          <Select
            name="subtype_id"
            label="Default Subtype"
            value={subtypeId}
            onChange={setSubtypeId}
            required
          >
            <option value="">Select subtype</option>
            <option value={NEW_VALUE}>+ New Subtype</option>
            {filteredSubtypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>

          <Input
            name="default_description"
            label="Default Description Optional"
            placeholder="Optional text used when item description is blank"
          />

          {subtypeId === NEW_VALUE && (
            <Input name="new_subtype_name" label="Subtype Name" required />
          )}
        </div>

        {prefillMissingNumbers.length > 0 && (
          <div className="mt-5 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100">
            <p className="font-semibold text-amber-300">
              ⚠️ Adding missing collectibles
            </p>
            <p className="mt-1">
              Prefilled rows for:{" "}
              {prefillMissingNumbers.map((number) => `#${number}`).join(", ")}
            </p>
          </div>
        )}

        {selectedSeries && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black p-4 text-sm text-gray-400">
            <p>
              Selected series:{" "}
              <span className="text-white">{selectedSeries.name}</span>
            </p>

            <p className="mt-1">
              Total items:{" "}
              <span className="text-cyan-300">
                {selectedSeries.total_units || "Not set"}
              </span>
            </p>

            <p className="mt-1">
              Current rows:{" "}
              <span className="text-cyan-300">{items.length}</span>
            </p>
          </div>
        )}
      </Card>

      <Card title="Series Items">
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={item.localId}
              className="rounded-3xl border border-white/10 bg-black p-5"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Item Row {index + 1}</h3>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.localId)}
                    className="rounded-full border border-red-400/30 px-4 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="hidden"
                name={`item_${index}_local_id`}
                value={item.localId}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  name={`item_${index}_series_number`}
                  label="Series Number"
                  type="number"
                  required
                  value={item.seriesNumber}
                  onChange={(value) =>
                    updateItem(item.localId, { seriesNumber: value })
                  }
                  placeholder="Example: 1"
                />

                <Select
                  name={`item_${index}_character_id`}
                  label="Character"
                  value={item.characterId}
                  onChange={(value) =>
                    updateItem(item.localId, {
                      characterId: value,
                      newCharacterName:
                        value === NEW_VALUE ? item.newCharacterName : "",
                      newCharacterNotes:
                        value === NEW_VALUE ? item.newCharacterNotes : "",
                      newCharacterReferenceType:
                        value === NEW_VALUE
                          ? item.newCharacterReferenceType
                          : "OTHER",
                      newCharacterReferenceUrl:
                        value === NEW_VALUE
                          ? item.newCharacterReferenceUrl
                          : "",
                      newCharacterReferenceLabel:
                        value === NEW_VALUE
                          ? item.newCharacterReferenceLabel
                          : "",
                    })
                  }
                  required
                >
                  <option value="">Select character</option>
                  <option value={NEW_VALUE}>+ New Character</option>
                  {filteredCharacters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </Select>

                {item.characterId === NEW_VALUE && (
                  <>
                    <Input
                      name={`item_${index}_new_character_name`}
                      label="New Character Name"
                      required
                      value={item.newCharacterName}
                      onChange={(value) =>
                        updateItem(item.localId, {
                          newCharacterName: value,
                        })
                      }
                      placeholder="Example: Kiriko"
                    />

                    <Textarea
                      name={`item_${index}_new_character_notes`}
                      label="New Character Notes Optional"
                      value={item.newCharacterNotes}
                      onChange={(value) =>
                        updateItem(item.localId, {
                          newCharacterNotes: value,
                        })
                      }
                      placeholder="Optional notes"
                    />

                    <Select
                      name={`item_${index}_new_character_reference_type`}
                      label="Reference Type Optional"
                      value={item.newCharacterReferenceType}
                      onChange={(value) =>
                        updateItem(item.localId, {
                          newCharacterReferenceType:
                            value as DraftItem["newCharacterReferenceType"],
                        })
                      }
                    >
                      <option value="WIKIPEDIA">Wikipedia</option>
                      <option value="OFFICIAL">Official</option>
                      <option value="FANDOM">Fandom</option>
                      <option value="OTHER">Other</option>
                    </Select>

                    <Input
                      name={`item_${index}_new_character_reference_url`}
                      label="Reference URL Optional"
                      type="url"
                      value={item.newCharacterReferenceUrl}
                      onChange={(value) =>
                        updateItem(item.localId, {
                          newCharacterReferenceUrl: value,
                        })
                      }
                      placeholder="https://..."
                    />

                    <Input
                      name={`item_${index}_new_character_reference_label`}
                      label="Reference Label Optional"
                      value={item.newCharacterReferenceLabel}
                      onChange={(value) =>
                        updateItem(item.localId, {
                          newCharacterReferenceLabel: value,
                        })
                      }
                      placeholder="Example: Official Bio"
                    />
                  </>
                )}

                <Select
                  name={`item_${index}_status`}
                  label="Status"
                  value={item.status}
                  onChange={(value) =>
                    updateItem(item.localId, {
                      status: value as DraftItem["status"],
                    })
                  }
                  required
                >
                  <option value="OWNED">Owned</option>
                  <option value="PLANNED">Planned</option>
                  <option value="WISHLIST">Wishlist</option>
                </Select>

                <Input
                  name={`item_${index}_custom_title`}
                  label="Custom Title Optional"
                  value={item.customTitle}
                  onChange={(value) =>
                    updateItem(item.localId, { customTitle: value })
                  }
                  placeholder="Leave blank to auto-generate"
                />

                <div className="sm:col-span-2">
                  <Textarea
                    name={`item_${index}_description`}
                    label="Item Description Optional"
                    value={item.description}
                    onChange={(value) =>
                      updateItem(item.localId, { description: value })
                    }
                    placeholder="Leave blank to use default description"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Images For This Item Optional
                  </label>

                  <input
                    name={`item_${index}_images`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      updateItem(item.localId, {
                        fileNames: files.map((file) => file.name),
                      });
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                  />

                  {item.fileNames.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.fileNames.map((name) => (
                        <span
                          key={name}
                          className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-6 w-full rounded-full border border-cyan-400/30 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
        >
          + Add Item
        </button>
      </Card>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-cyan-400 px-6 py-4 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating Series Items..." : "Create Series Items"}
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-6 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        step={type === "number" ? "1" : undefined}
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
      />
    </div>
  );
}

function Textarea({
  name,
  label,
  required = false,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
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