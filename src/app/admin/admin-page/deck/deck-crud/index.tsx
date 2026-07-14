"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  adminAPI,
  type AdminDeck,
  type AdminDeckModerationStatus,
  type AdminDeckVisibility,
  type AdminUpdateDeckInput,
  type AdminUser,
} from "@/services/api";
import {
  formatDate,
  formatNumber,
} from "../../dashboard/components/formatters";

type DeckFilters = {
  keyword: string;
  visibility: AdminDeckVisibility | "all";
  moderationStatus: AdminDeckModerationStatus | "all";
};

type DeckFormState = {
  title: string;
  description: string;
  visibility: AdminDeckVisibility;
  tagsText: string;
  ownerId: string;
};

const visibilityOptions: AdminDeckVisibility[] = ["private", "link", "public"];
const moderationOptions: AdminDeckModerationStatus[] = [
  "active",
  "hidden",
  "deleted",
];

const defaultCreateForm: DeckFormState = {
  title: "",
  description: "",
  visibility: "private",
  tagsText: "",
  ownerId: "",
};

export function DecksPanel() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DeckFilters>({
    keyword: "",
    visibility: "all",
    moderationStatus: "all",
  });
  const [createForm, setCreateForm] =
    useState<DeckFormState>(defaultCreateForm);
  const [detailForm, setDetailForm] =
    useState<DeckFormState>(defaultCreateForm);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [hideReason, setHideReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const deckParams = useMemo(
    () => ({
      page: 1,
      take: 20,
      keyword: filters.keyword.trim() || undefined,
      visibility:
        filters.visibility === "all" ? undefined : filters.visibility,
      moderationStatus:
        filters.moderationStatus === "all"
          ? undefined
          : filters.moderationStatus,
    }),
    [filters],
  );

  const decksQuery = useQuery({
    queryKey: ["admin", "decks", deckParams],
    queryFn: () => adminAPI.getDecks(deckParams),
    retry: false,
  });

  const ownersQuery = useQuery({
    queryKey: ["admin", "users", "deck-owner-options"],
    queryFn: () => adminAPI.getUsers({ page: 1, take: 100, status: "active" }),
    retry: false,
  });

  const decks = useMemo(() => decksQuery.data?.data ?? [], [decksQuery.data]);
  const owners = useMemo(() => ownersQuery.data?.data ?? [], [ownersQuery.data]);
  const selectedDeck = useMemo(() => {
    if (!selectedDeckId) return null;
    return decks.find((deck) => getAdminDeckId(deck) === selectedDeckId) ?? null;
  }, [decks, selectedDeckId]);

  const deckDetailQuery = useQuery({
    queryKey: ["admin", "decks", selectedDeckId, "detail"],
    queryFn: () =>
      adminAPI.getDeck(selectedDeckId ?? "", { cardPage: 1, cardTake: 8 }),
    enabled: Boolean(selectedDeckId),
    retry: false,
  });

  const selectedDeckDetail = deckDetailQuery.data?.data ?? selectedDeck;

  const invalidateAdminDecks = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      adminAPI.createDeck({
        title: createForm.title.trim(),
        description: cleanOptionalText(createForm.description),
        visibility: createForm.visibility,
        tags: parseTags(createForm.tagsText),
        ownerId: createForm.ownerId,
      }),
    onError: showActionError,
    onSuccess: async (response) => {
      const deckId = getAdminDeckId(response.data);
      setActionError("");
      setActionMessage("Deck created.");
      setCreateForm((current) => ({
        ...defaultCreateForm,
        ownerId: current.ownerId,
      }));
      setDetailForm(toDeckFormState(response.data));
      setHideReason(response.data.moderationReason ?? "");
      if (deckId) setSelectedDeckId(deckId);
      await invalidateAdminDecks();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!selectedDeckId) throw new Error("No deck selected.");
      return adminAPI.updateDeck(selectedDeckId, toUpdatePayload(detailForm));
    },
    onError: showActionError,
    onSuccess: async (response) => {
      setActionError("");
      setActionMessage("Deck updated.");
      setDetailForm(toDeckFormState(response.data));
      await invalidateAdminDecks();
    },
  });

  const moderateMutation = useMutation({
    mutationFn: ({
      reason,
      status,
    }: {
      reason?: string;
      status: Exclude<AdminDeckModerationStatus, "deleted">;
    }) => {
      if (!selectedDeckId) throw new Error("No deck selected.");
      return adminAPI.moderateDeck(selectedDeckId, { reason, status });
    },
    onError: showActionError,
    onSuccess: async (response, variables) => {
      setActionError("");
      setActionMessage(
        variables.status === "hidden" ? "Deck hidden." : "Deck activated.",
      );
      setHideReason(response.data.moderationReason ?? "");
      await invalidateAdminDecks();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!selectedDeckId) throw new Error("No deck selected.");
      return adminAPI.deleteDeck(selectedDeckId);
    },
    onError: showActionError,
    onSuccess: async (response) => {
      setActionError("");
      setActionMessage("Deck deleted.");
      setDetailForm(toDeckFormState(response.data));
      await invalidateAdminDecks();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => {
      if (!selectedDeckId) throw new Error("No deck selected.");
      return adminAPI.restoreDeck(selectedDeckId);
    },
    onError: showActionError,
    onSuccess: async (response) => {
      setActionError("");
      setActionMessage("Deck restored.");
      setDetailForm(toDeckFormState(response.data));
      await invalidateAdminDecks();
    },
  });

  const isActionPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    moderateMutation.isPending ||
    deleteMutation.isPending ||
    restoreMutation.isPending;

  function showActionError(error: unknown) {
    setActionMessage("");
    setActionError(error instanceof Error ? error.message : "Admin action failed.");
  }

  function clearActionState() {
    setActionError("");
    setActionMessage("");
  }

  function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearActionState();

    if (!createForm.title.trim()) {
      setActionError("Please enter a deck title.");
      return;
    }

    if (!createForm.ownerId) {
      setActionError("Please choose an owner.");
      return;
    }

    createMutation.mutate();
  }

  function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearActionState();

    if (!detailForm.title.trim()) {
      setActionError("Please enter a deck title.");
      return;
    }

    updateMutation.mutate();
  }

  function handleOpenDeck(deck: AdminDeck) {
    const deckId = getAdminDeckId(deck);
    if (!deckId) return;
    clearActionState();
    setDetailForm(toDeckFormState(deck));
    setHideReason(deck.moderationReason ?? "");
    setSelectedDeckId(deckId);
  }

  function handleCloseDeck() {
    setSelectedDeckId(null);
    clearActionState();
    setHideReason("");
  }

  function handleDeleteDeck() {
    if (!window.confirm("Soft delete this deck?")) return;
    clearActionState();
    deleteMutation.mutate();
  }

  function handleHideDeck() {
    clearActionState();
    moderateMutation.mutate({
      status: "hidden",
      reason: cleanOptionalText(hideReason),
    });
  }

  function handleActivateDeck() {
    clearActionState();
    moderateMutation.mutate({ status: "active" });
  }

  function handleRestoreDeck() {
    clearActionState();
    restoreMutation.mutate();
  }

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            Decks
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            Create, inspect, moderate, and restore deck content.
          </p>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f6f3ee] px-5 text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:opacity-60"
          disabled={decksQuery.isFetching}
          onClick={() => decksQuery.refetch()}
          type="button"
        >
          {decksQuery.isFetching ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {actionError ? <InlineMessage tone="error">{actionError}</InlineMessage> : null}
      {actionMessage ? (
        <InlineMessage tone="success">{actionMessage}</InlineMessage>
      ) : null}

      <div className="grid gap-5 pt-6 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <CreateDeckForm
          form={createForm}
          isPending={createMutation.isPending}
          onChange={setCreateForm}
          onSubmit={handleCreateSubmit}
          owners={owners}
          ownersLoading={ownersQuery.isPending}
        />

        <div className="min-w-0">
          <DeckFiltersBar filters={filters} onChange={setFilters} />
          <DeckTable
            decks={decks}
            error={decksQuery.error}
            isError={decksQuery.isError}
            isLoading={decksQuery.isPending}
            onOpenDeck={handleOpenDeck}
            selectedDeckId={selectedDeckId}
          />
        </div>
      </div>

      {selectedDeckId ? (
        <DeckDetailModal
          actionError={actionError}
          actionMessage={actionMessage}
          deck={selectedDeckDetail}
          detailError={deckDetailQuery.error}
          form={detailForm}
          hideReason={hideReason}
          isActionPending={isActionPending}
          isLoading={deckDetailQuery.isFetching}
          onActivate={handleActivateDeck}
          onClose={handleCloseDeck}
          onDelete={handleDeleteDeck}
          onFormChange={setDetailForm}
          onHide={handleHideDeck}
          onHideReasonChange={setHideReason}
          onRestore={handleRestoreDeck}
          onUpdate={handleUpdateSubmit}
          owners={owners}
        />
      ) : null}
    </section>
  );
}

function CreateDeckForm({
  form,
  isPending,
  onChange,
  onSubmit,
  owners,
  ownersLoading,
}: {
  form: DeckFormState;
  isPending: boolean;
  onChange: (form: DeckFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  owners: AdminUser[];
  ownersLoading: boolean;
}) {
  return (
    <form
      className="rounded-[26px] border border-black/5 bg-[#fbf9f4] p-4"
      onSubmit={onSubmit}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
          <Plus aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-[#1b1c19]">Create deck</h3>
          <p className="text-xs font-semibold text-[#5f5e5e]">Manual source</p>
        </div>
      </div>

      <div className="space-y-3">
        <TextField
          disabled={isPending}
          label="Title"
          onChange={(value) => onChange({ ...form, title: value })}
          placeholder="Deck title"
          value={form.title}
        />
        <TextAreaField
          disabled={isPending}
          label="Description"
          onChange={(value) => onChange({ ...form, description: value })}
          placeholder="Short description"
          value={form.description}
        />
        <SelectField
          disabled={isPending}
          label="Owner"
          onChange={(value) => onChange({ ...form, ownerId: value })}
          value={form.ownerId}
        >
          <option value="">
            {ownersLoading ? "Loading owners..." : "Choose owner"}
          </option>
          {owners.map((owner) => {
            const ownerId = getAdminUserId(owner);
            if (!ownerId) return null;
            return (
              <option key={ownerId} value={ownerId}>
                {formatUserLabel(owner)}
              </option>
            );
          })}
        </SelectField>
        <SelectField
          disabled={isPending}
          label="Visibility"
          onChange={(value) =>
            onChange({ ...form, visibility: value as AdminDeckVisibility })
          }
          value={form.visibility}
        >
          {visibilityOptions.map((visibility) => (
            <option key={visibility} value={visibility}>
              {visibility}
            </option>
          ))}
        </SelectField>
        <TextField
          disabled={isPending}
          label="Tags"
          onChange={(value) => onChange({ ...form, tagsText: value })}
          placeholder="english, grammar"
          value={form.tagsText}
        />
      </div>

      <button
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#614db7] px-4 text-sm font-extrabold text-white transition hover:bg-[#4f3aa0] disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Plus aria-hidden="true" className="h-4 w-4" />
        )}
        Create
      </button>
    </form>
  );
}

function DeckFiltersBar({
  filters,
  onChange,
}: {
  filters: DeckFilters;
  onChange: (filters: DeckFilters) => void;
}) {
  return (
    <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_150px]">
      <label className="relative block">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#797583]"
        />
        <input
          className="h-11 w-full rounded-2xl border border-black/5 bg-[#fbf9f4] pl-10 pr-4 text-sm font-bold text-[#1b1c19] outline-none transition placeholder:text-[#9d8f8f] focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20"
          onChange={(event) =>
            onChange({ ...filters, keyword: event.target.value })
          }
          placeholder="Search decks"
          value={filters.keyword}
        />
      </label>
      <select
        className="h-11 rounded-2xl border border-black/5 bg-[#fbf9f4] px-3 text-sm font-bold text-[#1b1c19] outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20"
        onChange={(event) =>
          onChange({
            ...filters,
            visibility: event.target.value as DeckFilters["visibility"],
          })
        }
        value={filters.visibility}
      >
        <option value="all">All visibility</option>
        {visibilityOptions.map((visibility) => (
          <option key={visibility} value={visibility}>
            {visibility}
          </option>
        ))}
      </select>
      <select
        className="h-11 rounded-2xl border border-black/5 bg-[#fbf9f4] px-3 text-sm font-bold text-[#1b1c19] outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20"
        onChange={(event) =>
          onChange({
            ...filters,
            moderationStatus: event.target.value as DeckFilters["moderationStatus"],
          })
        }
        value={filters.moderationStatus}
      >
        <option value="all">All status</option>
        {moderationOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

function DeckTable({
  decks,
  error,
  isError,
  isLoading,
  onOpenDeck,
  selectedDeckId,
}: {
  decks: AdminDeck[];
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  onOpenDeck: (deck: AdminDeck) => void;
  selectedDeckId: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-black/5">
      <div className="grid grid-cols-[minmax(0,1fr)_86px_74px] bg-[#f6f2ff] px-3 py-3 text-[11px] font-extrabold uppercase tracking-normal text-[#614db7] md:grid-cols-[minmax(0,1fr)_96px_64px_104px_74px] xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_88px_92px_56px_104px_74px]">
        <span>Deck</span>
        <span className="hidden xl:block">Owner</span>
        <span className="hidden xl:block">Visibility</span>
        <span>Status</span>
        <span className="hidden md:block">Cards</span>
        <span className="hidden md:block">Updated</span>
        <span>Action</span>
      </div>

      <div>
        {isLoading ? <DecksLoading /> : null}
        {isError ? <DecksError error={error} /> : null}
        {!isLoading && !isError && !decks.length ? <DecksEmpty /> : null}

        {decks.map((deck) => {
          const deckId = getAdminDeckId(deck);
          const active = selectedDeckId === deckId;
          const status = readDeckStatus(deck);

          return (
            <div
              className={`grid grid-cols-[minmax(0,1fr)_86px_74px] items-center border-t border-black/5 px-3 py-4 text-sm font-semibold text-[#1b1c19] md:grid-cols-[minmax(0,1fr)_96px_64px_104px_74px] xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_88px_92px_56px_104px_74px] ${
                active ? "bg-[#fbf9f4]" : "bg-white"
              }`}
              key={deckId || deck.title}
            >
              <div className="min-w-0">
                <p className="truncate font-extrabold">{deck.title}</p>
                <p className="mt-1 truncate text-xs text-[#797583]">
                  {deck.description || "No description"}
                </p>
              </div>
              <span className="hidden truncate text-[#5f5e5e] xl:block">
                {formatOwnerLabel(deck)}
              </span>
              <span className="hidden capitalize text-[#5f5e5e] xl:block">
                {deck.visibility}
              </span>
              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-extrabold capitalize ${getStatusClassName(
                  status,
                )}`}
              >
                {status}
              </span>
              <span className="hidden md:block">
                {formatNumber(deck.cardCount ?? 0)}
              </span>
              <span className="hidden text-[#5f5e5e] md:block">
                {deck.updatedAt ? formatDate(deck.updatedAt) : "N/A"}
              </span>
              <button
                className="inline-flex h-9 w-fit items-center gap-1.5 rounded-2xl bg-[#f6f3ee] px-2.5 text-xs font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19]"
                onClick={() => onOpenDeck(deck)}
                type="button"
              >
                <Eye aria-hidden="true" className="h-4 w-4" />
                View
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeckDetailModal({
  actionError,
  actionMessage,
  deck,
  detailError,
  form,
  hideReason,
  isActionPending,
  isLoading,
  onActivate,
  onClose,
  onDelete,
  onFormChange,
  onHide,
  onHideReasonChange,
  onRestore,
  onUpdate,
  owners,
}: {
  actionError: string;
  actionMessage: string;
  deck: AdminDeck | null;
  detailError: unknown;
  form: DeckFormState;
  hideReason: string;
  isActionPending: boolean;
  isLoading: boolean;
  onActivate: () => void;
  onClose: () => void;
  onDelete: () => void;
  onFormChange: (form: DeckFormState) => void;
  onHide: () => void;
  onHideReasonChange: (reason: string) => void;
  onRestore: () => void;
  onUpdate: (event: FormEvent<HTMLFormElement>) => void;
  owners: AdminUser[];
}) {
  const status = deck ? readDeckStatus(deck) : "active";
  const isDeleted = status === "deleted";
  const isHidden = status === "hidden";
  const ownerExists = owners.some((owner) => getAdminUserId(owner) === form.ownerId);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-[32px] border border-black/5 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
              Deck Detail
            </p>
            <h3 className="mt-2 truncate [font-family:var(--font-outfit)] text-3xl font-extrabold text-[#1b1c19]">
              {deck?.title ?? "Loading deck"}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#5f5e5e]">
              {deck ? formatOwnerLabel(deck) : "Fetching detail API..."}
            </p>
          </div>
          <button
            aria-label="Close deck detail"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            disabled={isActionPending}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {detailError ? (
          <InlineMessage tone="error">
            {detailError instanceof Error
              ? detailError.message
              : "Unable to load deck detail."}
          </InlineMessage>
        ) : null}
        {actionError ? <InlineMessage tone="error">{actionError}</InlineMessage> : null}
        {actionMessage ? (
          <InlineMessage tone="success">{actionMessage}</InlineMessage>
        ) : null}

        <div className="grid gap-5 pt-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form className="space-y-4" onSubmit={onUpdate}>
            {isLoading && !deck ? <DecksLoading compact /> : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                disabled={isActionPending || !deck || isDeleted}
                label="Title"
                onChange={(value) => onFormChange({ ...form, title: value })}
                placeholder="Deck title"
                value={form.title}
              />
              <SelectField
                disabled={isActionPending || !deck || isDeleted}
                label="Visibility"
                onChange={(value) =>
                  onFormChange({
                    ...form,
                    visibility: value as AdminDeckVisibility,
                  })
                }
                value={form.visibility}
              >
                {visibilityOptions.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibility}
                  </option>
                ))}
              </SelectField>
            </div>
            <TextAreaField
              disabled={isActionPending || !deck || isDeleted}
              label="Description"
              onChange={(value) =>
                onFormChange({ ...form, description: value })
              }
              placeholder="Short description"
              value={form.description}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                disabled={isActionPending || !deck || isDeleted}
                label="Owner"
                onChange={(value) => onFormChange({ ...form, ownerId: value })}
                value={form.ownerId}
              >
                {form.ownerId && !ownerExists ? (
                  <option value={form.ownerId}>Current owner</option>
                ) : null}
                {owners.map((owner) => {
                  const ownerId = getAdminUserId(owner);
                  if (!ownerId) return null;
                  return (
                    <option key={ownerId} value={ownerId}>
                      {formatUserLabel(owner)}
                    </option>
                  );
                })}
              </SelectField>
              <TextField
                disabled={isActionPending || !deck || isDeleted}
                label="Tags"
                onChange={(value) =>
                  onFormChange({ ...form, tagsText: value })
                }
                placeholder="english, grammar"
                value={form.tagsText}
              />
            </div>

            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#614db7] px-5 text-sm font-extrabold text-white transition hover:bg-[#4f3aa0] disabled:opacity-50"
              disabled={isActionPending || !deck || isDeleted}
              type="submit"
            >
              {isActionPending ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <Save aria-hidden="true" className="h-4 w-4" />
              )}
              Save deck
            </button>

            <RecentCards deck={deck} />
          </form>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-[#cabeff] bg-[#f6f2ff] p-4">
              <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
                Moderation
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold capitalize ${getStatusClassName(
                    status,
                  )}`}
                >
                  {status}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold capitalize text-[#5f5e5e]">
                  {deck?.visibility ?? "private"}
                </span>
              </div>
              <TextAreaField
                disabled={isActionPending || !deck || isDeleted}
                label="Hide reason"
                onChange={onHideReasonChange}
                placeholder="Reason shown in audit"
                value={hideReason}
              />
              <div className="mt-3 grid gap-2">
                <ActionButton
                  disabled={isActionPending || !deck || isDeleted || isHidden}
                  icon={EyeOff}
                  label="Hide deck"
                  onClick={onHide}
                  tone="danger"
                />
                <ActionButton
                  disabled={isActionPending || !deck || isDeleted || !isHidden}
                  icon={Eye}
                  label="Activate deck"
                  onClick={onActivate}
                />
                <ActionButton
                  disabled={isActionPending || !deck || isDeleted}
                  icon={Trash2}
                  label="Delete deck"
                  onClick={onDelete}
                  tone="danger"
                />
                <ActionButton
                  disabled={isActionPending || !deck || !isDeleted}
                  icon={RotateCcw}
                  label="Restore deck"
                  onClick={onRestore}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Cards"
                value={formatNumber(deck?.cardCount ?? 0)}
              />
              <MetricCard
                label="Sessions"
                value={formatNumber(deck?.metrics?.sessionCount ?? 0)}
              />
              <MetricCard
                label="Learners"
                value={formatNumber(deck?.metrics?.learnerCount ?? 0)}
              />
              <MetricCard
                label="Accuracy"
                value={`${deck?.metrics?.accuracy ?? 0}%`}
              />
            </div>

            <div className="space-y-2">
              <DetailRow label="ID" value={deck ? getAdminDeckId(deck) : "N/A"} />
              <DetailRow
                label="Created"
                value={deck?.createdAt ? formatDate(deck.createdAt) : "N/A"}
              />
              <DetailRow
                label="Updated"
                value={deck?.updatedAt ? formatDate(deck.updatedAt) : "N/A"}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TextField({
  disabled,
  label,
  onChange,
  placeholder,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  const inputId = `deck-field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="text-xs font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </span>
      <input
        className="mt-2 h-11 w-full rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-[#1b1c19] outline-none transition placeholder:text-[#9d8f8f] focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20 disabled:opacity-60"
        disabled={disabled}
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function TextAreaField({
  disabled,
  label,
  onChange,
  placeholder,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  const inputId = `deck-field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label className="mt-3 block" htmlFor={inputId}>
      <span className="text-xs font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </span>
      <textarea
        className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-semibold text-[#1b1c19] outline-none transition placeholder:text-[#9d8f8f] focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20 disabled:opacity-60"
        disabled={disabled}
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function SelectField({
  children,
  disabled,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const inputId = `deck-field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="text-xs font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </span>
      <select
        className="mt-2 h-11 w-full rounded-2xl border border-black/5 bg-white px-3 text-sm font-bold text-[#1b1c19] outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20 disabled:opacity-60"
        disabled={disabled}
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function ActionButton({
  disabled,
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  disabled: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  const toneClassName =
    tone === "danger"
      ? "bg-[#fff0f0] text-[#a33a3a] hover:bg-[#ffdad6]"
      : "bg-white text-[#5f5e5e] hover:text-[#1b1c19]";

  return (
    <button
      className={`inline-flex h-11 items-center gap-3 rounded-2xl px-4 text-sm font-extrabold transition disabled:pointer-events-none disabled:opacity-45 ${toneClassName}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

function InlineMessage({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "error" | "success";
}) {
  const toneClassName =
    tone === "error"
      ? "bg-[#fff0f0] text-[#a33a3a]"
      : "bg-[#f6f2ff] text-[#614db7]";

  return (
    <p
      aria-live="polite"
      className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold ${toneClassName}`}
    >
      {tone === "success" ? (
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
      ) : (
        <AlertTriangle aria-hidden="true" className="h-4 w-4" />
      )}
      {children}
    </p>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf9f4] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold text-[#1b1c19]">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf9f4] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-extrabold text-[#1b1c19]">
        {value}
      </p>
    </div>
  );
}

function RecentCards({ deck }: { deck: AdminDeck | null }) {
  const cards = deck?.cards?.data ?? [];

  if (!cards.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-black/10 bg-[#fbf9f4] p-5 text-center text-sm font-bold text-[#797583]">
        No cards returned for this deck.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-black/5">
      <div className="border-b border-black/5 px-4 py-3">
        <p className="text-sm font-extrabold text-[#1b1c19]">Recent cards</p>
      </div>
      <div className="divide-y divide-black/5">
        {cards.map((card) => (
          <div className="grid gap-2 px-4 py-3 sm:grid-cols-2" key={card._id ?? card.id}>
            <p className="text-sm font-bold text-[#1b1c19]">
              {card.front ?? "N/A"}
            </p>
            <p className="text-sm font-semibold text-[#5f5e5e]">
              {card.back ?? "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecksLoading({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm font-bold text-[#614db7] ${
        compact ? "min-h-[120px]" : "min-h-[220px] w-full"
      }`}
    >
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading decks
    </div>
  );
}

function DecksError({ error }: { error: unknown }) {
  return (
    <div className="w-full bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]">
      {error instanceof Error ? error.message : "Unable to load decks."}
    </div>
  );
}

function DecksEmpty() {
  return (
    <div className="w-full p-8 text-center text-sm font-bold text-[#614db7]">
      No decks found.
    </div>
  );
}

function getAdminDeckId(deck: AdminDeck) {
  return deck.id ?? deck._id ?? "";
}

function getAdminUserId(user: AdminUser) {
  return user.id ?? user._id ?? "";
}

function readDeckOwnerId(deck: AdminDeck) {
  if (typeof deck.createdBy === "string") return deck.createdBy;
  return deck.owner?.id ?? deck.owner?._id ?? "";
}

function readDeckStatus(deck: AdminDeck): AdminDeckModerationStatus {
  if (deck.deletedAt) return "deleted";
  return deck.moderationStatus ?? "active";
}

function formatOwnerLabel(deck: AdminDeck) {
  if (deck.owner?.name || deck.owner?.email) {
    return deck.owner.name
      ? `${deck.owner.name}${deck.owner.email ? ` (${deck.owner.email})` : ""}`
      : deck.owner.email;
  }
  return readDeckOwnerId(deck) || "No owner";
}

function formatUserLabel(user: AdminUser) {
  return `${user.name || user.email} (${user.email})`;
}

function getStatusClassName(status: AdminDeckModerationStatus) {
  if (status === "deleted") return "bg-[#fff0f0] text-[#a33a3a]";
  if (status === "hidden") return "bg-[#fff7df] text-[#8a5b00]";
  return "bg-[#e9f8ec] text-[#23713b]";
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

function cleanOptionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toDeckFormState(deck: AdminDeck): DeckFormState {
  return {
    title: deck.title ?? "",
    description: deck.description ?? "",
    visibility: deck.visibility ?? "private",
    tagsText: (deck.tags ?? []).join(", "),
    ownerId: readDeckOwnerId(deck),
  };
}

function toUpdatePayload(form: DeckFormState): AdminUpdateDeckInput {
  const payload: AdminUpdateDeckInput = {
    title: form.title.trim(),
    description: cleanOptionalText(form.description),
    visibility: form.visibility,
    tags: parseTags(form.tagsText),
  };

  if (form.ownerId) payload.ownerId = form.ownerId;
  return payload;
}
