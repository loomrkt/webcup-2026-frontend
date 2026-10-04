"use client";

import {
  BookOpenText,
  Bus,
  CheckCircle2,
  CircleAlert,
  Edit,
  Loader2,
  MapPin,
  Newspaper,
  Plus,
  RefreshCcw,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/hud-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/common/error-message";
import { fetchAdminServices } from "@/services/services/services-service";
import type { Service } from "@/services/services/types";
import {
  createGlossaryTerm,
  createMobilityLine,
  createPlace,
  createPublication,
  createService,
  deleteGlossaryTerm,
  deleteMobilityLine,
  deletePlace,
  deletePublication,
  deleteService,
  fetchAllGlossaryTerms,
  fetchAllMobilityLines,
  fetchAllPlaces,
  fetchAllPublications,
  type GlossaryTermFormValues,
  type ManagedGlossaryTerm,
  type ManagedMobilityLine,
  type ManagedPlace,
  type ManagedPublication,
  type MobilityLineFormValues,
  type PlaceFormValues,
  type PublicationFormValues,
  type ServiceFormValues,
  updateGlossaryTerm,
  updateMobilityLine,
  updatePlace,
  updatePublication,
  updateService,
} from "../admin-content-api";

const fieldClass =
  "h-10 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

const textareaClass =
  "h-28 w-full rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3 text-sm text-[var(--dg-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur transition-all outline-none placeholder:text-[var(--dg-text-faint)] hover:border-[var(--dg-border-strong)] focus:border-[var(--dg-accent)]/70 focus:ring-4 focus:ring-[var(--dg-accent)]/15";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-[var(--dg-text-faint)]"
      >
        {label}
        {required ? " (obligatoire)" : ""}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-[var(--dg-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CheckboxField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex w-fit cursor-pointer items-center gap-2 text-xs text-[var(--dg-text-muted)]"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 cursor-pointer accent-[var(--dg-accent)]"
      />
      {label}
    </label>
  );
}

interface FormCtx<T, V> {
  initial: T | null;
  onSubmit: (values: V) => Promise<void>;
  onCancel: () => void;
}

interface ManagerProps<T extends { id: string }, V> {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fetchAll: () => Promise<T[]>;
  createItem: (values: V) => Promise<unknown>;
  updateItem: (id: string, values: V) => Promise<unknown>;
  deleteItem: (id: string) => Promise<unknown>;
  itemLabel: (item: T) => string;
  itemSub?: (item: T) => string;
  renderForm: (ctx: FormCtx<T, V>) => React.ReactNode;
}

function Manager<T extends { id: string }, V>({
  title,
  description,
  icon,
  fetchAll,
  createItem,
  updateItem,
  deleteItem,
  itemLabel,
  itemSub,
  renderForm,
}: ManagerProps<T, V>) {
  const Icon = icon;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await fetchAll());
    } catch (error) {
      setLoadError(
        getApiErrorMessage(error, "Impossible de charger la liste."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchAll();
        if (!cancelled) setItems(data);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            getApiErrorMessage(error, "Impossible de charger la liste."),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: V) => {
    setMessageError(null);
    setMessage(null);
    try {
      if (editing) {
        await updateItem(editing.id, values);
        setMessage(`« ${itemLabel(editing)} » mis à jour.`);
      } else {
        await createItem(values);
        setMessage("Créé avec succès.");
      }
      setEditing(null);
      await refresh();
    } catch (error) {
      setMessageError(
        getApiErrorMessage(error, "L'opération a échoué."),
      );
    }
  };

  const handleDelete = async (item: T) => {
    setDeleting(true);
    setMessageError(null);
    setMessage(null);
    try {
      await deleteItem(item.id);
      setMessage(`« ${itemLabel(item)} » supprimé.`);
      if (editing?.id === item.id) setEditing(null);
      await refresh();
    } catch (error) {
      setMessageError(
        getApiErrorMessage(error, "Impossible de supprimer cet élément."),
      );
    } finally {
      setDeleting(false);
      setConfirmingId(null);
    }
  };

  return (
    <HudPanel edge className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--dg-text)]">
          <Icon className="size-4 text-[var(--dg-accent-bright)]" aria-hidden />
          {title}
        </h2>
        <p className="text-xs text-[var(--dg-text-muted)]">{description}</p>
      </div>

      {message && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-success-border)] bg-[var(--dg-success-soft)] px-4 py-3 text-sm text-[var(--dg-success)]"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {message}
        </p>
      )}
      {messageError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[var(--dg-danger-border)] bg-[var(--dg-danger-soft)] px-4 py-3 text-sm text-[var(--dg-danger)]"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {messageError}
        </p>
      )}

      <div
        key={editing?.id ?? "new"}
        className="flex flex-col gap-3 rounded-xl border border-[var(--dg-border)] bg-[var(--dg-bg-card)]/50 p-4"
      >
        {editing ? (
          <p className="flex items-center gap-2 text-xs text-[var(--dg-accent-bright)]">
            <Edit className="size-3.5" aria-hidden />
            Modification de « {itemLabel(editing)} »
          </p>
        ) : null}
        {renderForm({
          initial: editing,
          onSubmit: handleSubmit,
          onCancel: () => setEditing(null),
        })}
      </div>

      {loadError ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-[var(--dg-text-muted)]">{loadError}</p>
          <Button
            variant="outline"
            onClick={() => void refresh()}
            className="cursor-pointer border-[var(--dg-border)] text-[var(--dg-text-muted)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl bg-white/10" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--dg-border)] px-4 py-3 text-sm text-[var(--dg-text-muted)]">
          Aucun élément pour le moment — utilisez le formulaire ci-dessus pour
          en créer.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="hud-cut flex flex-wrap items-center gap-3 border border-[var(--dg-border)] bg-[var(--dg-bg-card)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-white">
                  {itemLabel(item)}
                </p>
                {itemSub ? (
                  <p className="truncate text-[11px] text-[var(--dg-text-faint)]">
                    {itemSub(item)}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(item);
                  setConfirmingId(null);
                }}
                aria-label={`Modifier ${itemLabel(item)}`}
                className="cursor-pointer border border-[var(--dg-border)] text-[var(--dg-text-muted)] hover:text-[var(--dg-accent-bright)]"
              >
                <Edit aria-hidden />
                Modifier
              </Button>
              {confirmingId === item.id ? (
                <span className="flex items-center gap-2 text-xs text-[var(--dg-danger)]">
                  Confirmer ?
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                    onClick={() => void handleDelete(item)}
                    className="cursor-pointer"
                  >
                    {deleting ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <Trash2 className="size-3.5" aria-hidden />
                    )}
                    Oui
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmingId(null)}
                    className="cursor-pointer border border-[var(--dg-border)] text-[var(--dg-text-muted)]"
                  >
                    Non
                  </Button>
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingId(item.id)}
                  aria-label={`Supprimer ${itemLabel(item)}`}
                  className="cursor-pointer border border-[var(--dg-danger-border)] text-[var(--dg-danger)] hover:bg-[var(--dg-danger-soft)]"
                >
                  <Trash2 aria-hidden />
                  Supprimer
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </HudPanel>
  );
}

function SubmitBar({
  editing,
  submitLabel,
  onCancel,
}: {
  editing: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="submit" className="dg-btn-accent sm:w-auto">
        <Plus aria-hidden />
        {submitLabel}
      </Button>
      {editing ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="cursor-pointer border border-[var(--dg-border)] text-[var(--dg-text-muted)]"
        >
          Annuler la modification
        </Button>
      ) : null}
    </div>
  );
}

function ServiceForm({ initial, onSubmit, onCancel }: FormCtx<Service, ServiceFormValues>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<Service["status"]>(initial?.status ?? "available");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (name.trim().length < 2) {
      setNameError("Le nom doit contenir au moins 2 caractères.");
      return;
    }
    await onSubmit({
      name: name.trim(),
      category: category.trim() || null,
      icon: icon.trim() || null,
      description: description.trim() || null,
      status,
      active: true,
      featured,
    });
    setName("");
    setCategory("");
    setIcon("");
    setDescription("");
    setStatus("available");
    setFeatured(false);
    setNameError(null);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="flex flex-col gap-3"
    >
      <Field id="svc-name" label="Nom" required error={nameError}>
        <input
          id="svc-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setNameError(null);
          }}
          placeholder="Ex. : État civil"
          className={cn(fieldClass, nameError && "border-[var(--dg-danger-border)]")}
        />
      </Field>
      <Field id="svc-category" label="Catégorie">
        <input
          id="svc-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Ex. : administration, sante, logement…"
          className={fieldClass}
        />
      </Field>
      <Field id="svc-icon" label="Icône">
        <input
          id="svc-icon"
          value={icon}
          onChange={(event) => setIcon(event.target.value)}
          placeholder="Ex. : building, bus, heart…"
          className={fieldClass}
        />
      </Field>
      <Field id="svc-status" label="Statut">
        <select
          id="svc-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as Service["status"])
          }
          className={fieldClass}
        >
          <option value="available">Opérationnel</option>
          <option value="maintenance">Maintenance</option>
          <option value="incident">Indisponible (incident)</option>
        </select>
      </Field>
      <Field id="svc-desc" label="Description">
        <textarea
          id="svc-desc"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description du service et de ses démarches…"
          className={textareaClass}
        />
      </Field>
      <CheckboxField
        id="svc-featured"
        label="Mettre en avant (F28)"
        checked={featured}
        onChange={setFeatured}
      />
      <SubmitBar
        editing={initial !== null}
        submitLabel={initial ? "Enregistrer le service" : "Créer le service"}
        onCancel={onCancel}
      />
    </form>
  );
}

function PublicationForm({
  initial,
  onSubmit,
  onCancel,
}: FormCtx<ManagedPublication, PublicationFormValues>) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const handleSubmit = async () => {
    let invalid = false;
    if (title.trim().length < 2) {
      setTitleError("Le titre doit contenir au moins 2 caractères.");
      invalid = true;
    }
    if (content.trim().length < 10) {
      setContentError("Le contenu doit contenir au moins 10 caractères.");
      invalid = true;
    }
    if (invalid) return;
    await onSubmit({
      title: title.trim(),
      summary: summary.trim() || null,
      content: content.trim(),
      published,
    });
    setTitle("");
    setSummary("");
    setContent("");
    setPublished(true);
    setTitleError(null);
    setContentError(null);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="flex flex-col gap-3"
    >
      <Field id="pub-title" label="Titre" required error={titleError}>
        <input
          id="pub-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleError(null);
          }}
          placeholder="Ex. : Nouveaux horaires de la mairie"
          className={cn(fieldClass, titleError && "border-[var(--dg-danger-border)]")}
        />
      </Field>
      <Field id="pub-summary" label="Résumé">
        <input
          id="pub-summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Phrase d'accroche affichée dans la liste…"
          className={fieldClass}
        />
      </Field>
      <Field id="pub-content" label="Contenu" required error={contentError}>
        <textarea
          id="pub-content"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setContentError(null);
          }}
          placeholder="Texte complet de la publication…"
          className={cn(
            textareaClass,
            contentError && "border-[var(--dg-danger-border)]",
          )}
        />
      </Field>
      <CheckboxField
        id="pub-published"
        label="Publier (visible des habitants)"
        checked={published}
        onChange={setPublished}
      />
      <SubmitBar
        editing={initial !== null}
        submitLabel={initial ? "Enregistrer l'actualité" : "Créer l'actualité"}
        onCancel={onCancel}
      />
    </form>
  );
}

function GlossaryForm({
  initial,
  onSubmit,
  onCancel,
}: FormCtx<ManagedGlossaryTerm, GlossaryTermFormValues>) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [definition, setDefinition] = useState(initial?.definition ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [termError, setTermError] = useState<string | null>(null);
  const [definitionError, setDefinitionError] = useState<string | null>(null);

  const handleSubmit = async () => {
    let invalid = false;
    if (term.trim().length < 2) {
      setTermError("Le terme doit contenir au moins 2 caractères.");
      invalid = true;
    }
    if (definition.trim().length < 5) {
      setDefinitionError("La définition doit contenir au moins 5 caractères.");
      invalid = true;
    }
    if (invalid) return;
    await onSubmit({
      term: term.trim(),
      definition: definition.trim(),
      category: category.trim() || null,
      active: true,
    });
    setTerm("");
    setDefinition("");
    setCategory("");
    setTermError(null);
    setDefinitionError(null);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="flex flex-col gap-3"
    >
      <Field id="gl-term" label="Terme" required error={termError}>
        <input
          id="gl-term"
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setTermError(null);
          }}
          placeholder="Ex. : État civil"
          className={cn(fieldClass, termError && "border-[var(--dg-danger-border)]")}
        />
      </Field>
      <Field id="gl-category" label="Catégorie">
        <input
          id="gl-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Ex. : administration"
          className={fieldClass}
        />
      </Field>
      <Field id="gl-def" label="Définition" required error={definitionError}>
        <textarea
          id="gl-def"
          value={definition}
          onChange={(event) => {
            setDefinition(event.target.value);
            setDefinitionError(null);
          }}
          placeholder="Définition simple et compréhensible…"
          className={cn(
            textareaClass,
            definitionError && "border-[var(--dg-danger-border)]",
          )}
        />
      </Field>
      <SubmitBar
        editing={initial !== null}
        submitLabel={initial ? "Enregistrer le terme" : "Créer le terme"}
        onCancel={onCancel}
      />
    </form>
  );
}

function MobilityForm({
  initial,
  onSubmit,
  onCancel,
}: FormCtx<ManagedMobilityLine, MobilityLineFormValues>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [destination, setDestination] = useState(initial?.destination ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [frequency, setFrequency] = useState(initial?.frequency ?? "");
  const [info, setInfo] = useState(initial?.info ?? "");
  const [accessible, setAccessible] = useState(initial?.accessible ?? true);
  const [nameError, setNameError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  const handleSubmit = async () => {
    let invalid = false;
    if (name.trim().length < 2) {
      setNameError("Le nom doit contenir au moins 2 caractères.");
      invalid = true;
    }
    if (!/^[A-Za-z0-9]+$/.test(code.trim()) || code.trim().length < 1) {
      setCodeError("Le code doit être alphanumérique (ex. : L1).");
      invalid = true;
    }
    if (invalid) return;
    await onSubmit({
      name: name.trim(),
      code: code.trim(),
      origin: origin.trim() || null,
      destination: destination.trim() || null,
      color: color.trim() || null,
      price: price.trim() || null,
      frequency: frequency.trim() || null,
      info: info.trim() || null,
      accessible,
      active: true,
    });
    setName("");
    setCode("");
    setOrigin("");
    setDestination("");
    setColor("");
    setPrice("");
    setFrequency("");
    setInfo("");
    setAccessible(true);
    setNameError(null);
    setCodeError(null);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="flex flex-col gap-3"
    >
      <Field id="mb-name" label="Nom" required error={nameError}>
        <input
          id="mb-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setNameError(null);
          }}
          placeholder="Ex. : Tramway Nova"
          className={cn(fieldClass, nameError && "border-[var(--dg-danger-border)]")}
        />
      </Field>
      <Field id="mb-code" label="Code" required error={codeError}>
        <input
          id="mb-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setCodeError(null);
          }}
          placeholder="Ex. : T1"
          className={cn(fieldClass, codeError && "border-[var(--dg-danger-border)]")}
        />
      </Field>
      <Field id="mb-origin" label="Origine">
        <input
          id="mb-origin"
          value={origin}
          onChange={(event) => setOrigin(event.target.value)}
          placeholder="Ex. : Gare Centrale"
          className={fieldClass}
        />
      </Field>
      <Field id="mb-dest" label="Destination">
        <input
          id="mb-dest"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Ex. : Quartier Sud"
          className={fieldClass}
        />
      </Field>
      <Field id="mb-price" label="Prix">
        <input
          id="mb-price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Ex. : 2,00 € / trajet"
          className={fieldClass}
        />
      </Field>
      <Field id="mb-freq" label="Fréquence">
        <input
          id="mb-freq"
          value={frequency}
          onChange={(event) => setFrequency(event.target.value)}
          placeholder="Ex. : Toutes les 10 min en journée"
          className={fieldClass}
        />
      </Field>
      <Field id="mb-color" label="Couleur (hex)">
        <input
          id="mb-color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          placeholder="Ex. : #2563eb"
          className={fieldClass}
        />
      </Field>
      <Field id="mb-info" label="Informations">
        <textarea
          id="mb-info"
          value={info}
          onChange={(event) => setInfo(event.target.value)}
          placeholder="Détails utiles aux voyageurs…"
          className={textareaClass}
        />
      </Field>
      <CheckboxField
        id="mb-accessible"
        label="Accessible PMR"
        checked={accessible}
        onChange={setAccessible}
      />
      <SubmitBar
        editing={initial !== null}
        submitLabel={initial ? "Enregistrer la ligne" : "Créer la ligne"}
        onCancel={onCancel}
      />
    </form>
  );
}

function PlaceForm({ initial, onSubmit, onCancel }: FormCtx<ManagedPlace, PlaceFormValues>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [hours, setHours] = useState(initial?.hours ?? "");
  const [emergency, setEmergency] = useState(initial?.emergency ?? false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleSubmit = async () => {
    let invalid = false;
    if (name.trim().length < 2) {
      setNameError("Le nom doit contenir au moins 2 caractères.");
      invalid = true;
    }
    if (category.trim().length < 2) {
      setCategoryError("La catégorie doit contenir au moins 2 caractères.");
      invalid = true;
    }
    if (invalid) return;
    await onSubmit({
      name: name.trim(),
      category: category.trim(),
      address: address.trim() || null,
      phone: phone.trim() || null,
      hours: hours.trim() || null,
      emergency,
      active: true,
    });
    setName("");
    setCategory("");
    setAddress("");
    setPhone("");
    setHours("");
    setEmergency(false);
    setNameError(null);
    setCategoryError(null);
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="flex flex-col gap-3"
    >
      <Field id="pl-name" label="Nom" required error={nameError}>
        <input
          id="pl-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setNameError(null);
          }}
          placeholder="Ex. : Maison des associations"
          className={cn(fieldClass, nameError && "border-[var(--dg-danger-border)]")}
        />
      </Field>
      <Field id="pl-category" label="Catégorie" required error={categoryError}>
        <input
          id="pl-category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setCategoryError(null);
          }}
          placeholder="Ex. : sante, securite, administration, associations…"
          list="place-categories"
          className={cn(
            fieldClass,
            categoryError && "border-[var(--dg-danger-border)]",
          )}
        />
        <datalist id="place-categories">
          <option value="sante" />
          <option value="securite" />
          <option value="administration" />
          <option value="associations" />
          <option value="culture" />
          <option value="sports" />
        </datalist>
      </Field>
      <Field id="pl-address" label="Adresse">
        <input
          id="pl-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Ex. : 5 Rue des Solidarités, Quartier Est"
          className={fieldClass}
        />
      </Field>
      <Field id="pl-phone" label="Téléphone">
        <input
          id="pl-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Ex. : 02 99 00 12 34"
          className={fieldClass}
        />
      </Field>
      <Field id="pl-hours" label="Horaires">
        <input
          id="pl-hours"
          value={hours}
          onChange={(event) => setHours(event.target.value)}
          placeholder="Ex. : Mar–Sam 10h–18h"
          className={fieldClass}
        />
      </Field>
      <CheckboxField
        id="pl-emergency"
        label="Lieu d'urgence (hôpital, police, pompiers…)"
        checked={emergency}
        onChange={setEmergency}
      />
      <SubmitBar
        editing={initial !== null}
        submitLabel={initial ? "Enregistrer le lieu" : "Créer le lieu"}
        onCancel={onCancel}
      />
    </form>
  );
}

export function AdminContent() {
  return (
    <div className="flex flex-col gap-4">
      <Manager<Service, ServiceFormValues>
        title="Services"
        description="Créez, modifiez ou supprimez les services du catalogue (D05, F63)."
        icon={Wrench}
        fetchAll={fetchAdminServices}
        createItem={createService}
        updateItem={updateService}
        deleteItem={deleteService}
        itemLabel={(service) => service.name}
        itemSub={(service) =>
          `${service.category ?? "sans catégorie"} · ${service.status}${
            service.featured ? " · en avant" : ""
          }`
        }
        renderForm={(ctx) => <ServiceForm {...ctx} />}
      />

      <Manager<ManagedPublication, PublicationFormValues>
        title="Actualités"
        description="Créez, modifiez ou supprimez les publications municipales (D06)."
        icon={Newspaper}
        fetchAll={fetchAllPublications}
        createItem={createPublication}
        updateItem={updatePublication}
        deleteItem={deletePublication}
        itemLabel={(publication) => publication.title}
        itemSub={(publication) =>
          `${publication.published ? "Publiée" : "Brouillon"} · ${
            publication.summary ?? ""
          }`
        }
        renderForm={(ctx) => <PublicationForm {...ctx} />}
      />

      <Manager<ManagedGlossaryTerm, GlossaryTermFormValues>
        title="Glossaire"
        description="Créez, modifiez ou supprimez les définitions en langage clair (D13)."
        icon={BookOpenText}
        fetchAll={fetchAllGlossaryTerms}
        createItem={createGlossaryTerm}
        updateItem={updateGlossaryTerm}
        deleteItem={deleteGlossaryTerm}
        itemLabel={(term) => term.term}
        itemSub={(term) => term.category ?? "sans catégorie"}
        renderForm={(ctx) => <GlossaryForm {...ctx} />}
      />

      <Manager<ManagedMobilityLine, MobilityLineFormValues>
        title="Lignes de transport"
        description="Créez, modifiez ou supprimez les lignes du réseau de mobilité (F36)."
        icon={Bus}
        fetchAll={fetchAllMobilityLines}
        createItem={createMobilityLine}
        updateItem={updateMobilityLine}
        deleteItem={deleteMobilityLine}
        itemLabel={(line) => `${line.name} (${line.code})`}
        itemSub={(line) =>
          `${line.origin ?? "?"} → ${line.destination ?? "?"} · ${
            line.frequency ?? ""
          }`
        }
        renderForm={(ctx) => <MobilityForm {...ctx} />}
      />

      <Manager<ManagedPlace, PlaceFormValues>
        title="Lieux & urgences"
        description="Créez, modifiez ou supprimez les lieux physiques et lieux d'urgence (F45, F46)."
        icon={MapPin}
        fetchAll={fetchAllPlaces}
        createItem={createPlace}
        updateItem={updatePlace}
        deleteItem={deletePlace}
        itemLabel={(place) => place.name}
        itemSub={(place) =>
          `${place.category} · ${place.hours ?? "horaires non renseignés"}${
            place.emergency ? " · URGENCE" : ""
          }`
        }
        renderForm={(ctx) => <PlaceForm {...ctx} />}
      />
    </div>
  );
}