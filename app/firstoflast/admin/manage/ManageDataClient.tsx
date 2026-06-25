"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  deleteBrand,
  deleteCategory,
  deleteCharacter,
  deleteFranchise,
  deleteLot,
  deleteSeries,
  deleteSubtype,
  updateBrand,
  updateCategory,
  updateCharacter,
  updateFranchise,
  updateLot,
  updateSeries,
  updateSubtype,
} from "../new/actions";

type EditableValue = string | number | boolean | null;

type Item = {
  id: number;
  name?: string;
  [key: string]: EditableValue | undefined;
};

type Props = {
  categories: Item[];
  subtypes: Item[];
  brands: Item[];
  franchises: Item[];
  characters: Item[];
  series: Item[];
  lots?: Item[];
};

type UpdateValues = Record<string, EditableValue>;

const blockedFields = new Set([
  "id",
  "created_at",
  "updated_at",
  "createdAt",
  "updatedAt",
  "user_id",
  "userId",
  "auth_user_id",
  "authUserId",
]);

const relationLabels: Record<string, string> = {
  category_id: "Category",
  subtype_id: "Subtype",
  brand_id: "Brand",
  franchise_id: "Franchise",
  character_id: "Character",
  series_id: "Series",
  lot_id: "Lot",
};

const enumFields: Record<string, string[]> = {
  format: ["MANGA", "ANIME", "GAME", "FILM", "MUSIC", "OTHER"],
  type: ["WIKIPEDIA", "OFFICIAL", "FANDOM", "OTHER"],
  condition: [
    "MINT",
    "NEAR_MINT",
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "POOR",
    "DAMAGED",
  ],
  status: ["OWNED", "PLANNED", "WISHLIST", "SOLD", "GIFTED"],
};

export default function ManageDataClient({
  categories,
  subtypes,
  brands,
  franchises,
  characters,
  series,
  lots = [],
}: Props) {
  const relationOptions: Record<string, Item[]> = {
    category_id: categories,
    subtype_id: subtypes,
    brand_id: brands,
    franchise_id: franchises,
    character_id: characters,
    series_id: series,
    lot_id: lots,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section
        title="Categories"
        items={categories}
        relationOptions={relationOptions}
        onDelete={deleteCategory}
        onUpdate={updateCategory}
      />

      <Section
        title="Subtypes"
        items={subtypes}
        relationOptions={relationOptions}
        onDelete={deleteSubtype}
        onUpdate={updateSubtype}
      />

      <Section
        title="Brands"
        items={brands}
        relationOptions={relationOptions}
        onDelete={deleteBrand}
        onUpdate={updateBrand}
      />

      <Section
        title="Franchises"
        items={franchises}
        relationOptions={relationOptions}
        onDelete={deleteFranchise}
        onUpdate={updateFranchise}
      />

      <Section
        title="Characters"
        items={characters}
        relationOptions={relationOptions}
        onDelete={deleteCharacter}
        onUpdate={updateCharacter}
      />

      <Section
        title="Series"
        items={series}
        relationOptions={relationOptions}
        onDelete={deleteSeries}
        onUpdate={updateSeries}
      />

      <Section
        title="Lots"
        items={lots}
        relationOptions={relationOptions}
        onDelete={deleteLot}
        onUpdate={updateLot}
      />
    </div>
  );
}

function Section({
  title,
  items,
  relationOptions,
  onDelete,
  onUpdate,
}: {
  title: string;
  items: Item[];
  relationOptions: Record<string, Item[]>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, values: UpdateValues) => Promise<void>;
}) {
  const router = useRouter();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fields =
    items.length > 0
      ? Object.keys(items[0]).filter((key) => !blockedFields.has(key))
      : ["name"];

  function startEdit(item: Item) {
    const nextValues: Record<string, string | boolean> = {};

    fields.forEach((field) => {
      const value = item[field];

      if (typeof value === "boolean") {
        nextValues[field] = value;
      } else {
        nextValues[field] =
          value === null || value === undefined ? "" : String(value);
      }
    });

    setEditingId(item.id);
    setValues(nextValues);
  }

  async function handleSave(id: number) {
    const payload: UpdateValues = {};

    fields.forEach((field) => {
      if (blockedFields.has(field)) return;

      const value = values[field];

      if (typeof value === "boolean") {
        payload[field] = value;
        return;
      }

      const stringValue = String(value ?? "").trim();

      if (stringValue === "") {
        payload[field] = null;
        return;
      }

      if (isNumericField(field) || isRelationField(field)) {
        const numericValue = Number(stringValue);
        payload[field] = Number.isFinite(numericValue) ? numericValue : null;
      } else {
        payload[field] = stringValue;
      }
    });

    if ("name" in payload && !String(payload.name || "").trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      setLoadingId(id);
      await onUpdate(id, payload);
      setEditingId(null);
      setValues({});
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(item: Item) {
    const label = item.name || `Record #${item.id}`;

    if (!confirm(`Delete "${label}"?`)) return;

    try {
      setLoadingId(item.id);
      await onDelete(item.id);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not delete this record. It may still be used by collectibles."
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No records yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const isLoading = loadingId === item.id;
            const label = item.name || `Record #${item.id}`;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black p-4"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <label key={field} className="block">
                        <span className="mb-1 block text-xs text-gray-500">
                          {formatLabel(field)}
                        </span>

                        {isRelationField(field) ? (
                          <select
                            value={String(values[field] ?? "")}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [field]: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                          >
                            <option value="">None</option>

                            {(relationOptions[field] ?? []).map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name ?? `Record #${option.id}`}
                              </option>
                            ))}
                          </select>
                        ) : isEnumField(field) ? (
                          <select
                            value={String(values[field] ?? "")}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [field]: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                          >
                            <option value="">None</option>

                            {enumFields[field].map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : typeof values[field] === "boolean" ? (
                          <input
                            type="checkbox"
                            checked={Boolean(values[field])}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [field]: event.target.checked,
                              }))
                            }
                            className="h-4 w-4"
                          />
                        ) : isLongTextField(field) ? (
                          <textarea
                            value={String(values[field] ?? "")}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [field]: event.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                          />
                        ) : (
                          <input
                            type={isNumericField(field) ? "number" : "text"}
                            value={String(values[field] ?? "")}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [field]: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-100">
                      {label}
                    </p>

                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      {fields
                        .filter((field) => field !== "name")
                        .map((field) => (
                          <p key={field}>
                            {formatLabel(field)}:{" "}
                            <span className="text-gray-300">
                              {displayValue(field, item[field], relationOptions)}
                            </span>
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSave(item.id)}
                        className="rounded-full border border-cyan-400/40 px-4 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/10 disabled:opacity-50"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setEditingId(null);
                          setValues({});
                        }}
                        className="rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => startEdit(item)}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDelete(item)}
                    className="rounded-full border border-red-400/30 px-4 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function isRelationField(field: string) {
  return field in relationLabels;
}

function isEnumField(field: string) {
  return field in enumFields;
}

function isNumericField(field: string) {
  return (
    field.includes("total") ||
    field.includes("number") ||
    field.includes("price") ||
    field.includes("amount") ||
    field.includes("cost") ||
    field.includes("size")
  );
}

function isLongTextField(field: string) {
  return (
    field.toLowerCase().includes("description") ||
    field.toLowerCase().includes("notes")
  );
}

function formatLabel(field: string) {
  return (
    relationLabels[field] ??
    field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function displayValue(
  field: string,
  value: EditableValue | undefined,
  relationOptions: Record<string, Item[]>
) {
  if (value === null || value === undefined || value === "") return "—";

  if (isRelationField(field)) {
    const option = relationOptions[field]?.find(
      (item) => Number(item.id) === Number(value)
    );

    return option?.name ?? `Record #${value}`;
  }

  return String(value);
}