"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { decksAPI, type Deck, type DeckVisibility } from "@/services/api";

export default function EditDeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const deckQuery = useQuery({ queryKey: ["decks", deckId], queryFn: () => decksAPI.getById(deckId) });
  if (deckQuery.isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#614db7]" /></div>;
  if (deckQuery.isError || !deckQuery.data?.data) return <div className="p-8"><div className="rounded-2xl bg-[#fff0f0] p-5 font-bold text-[#a33a3a]">{deckQuery.error?.message ?? "Deck not found."}</div></div>;
  return <EditDeckForm deck={deckQuery.data.data} key={deckQuery.data.data._id} />;
}

function EditDeckForm({ deck }: { deck: Deck }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description ?? "");
  const [visibility, setVisibility] = useState<DeckVisibility>(deck.visibility);
  const [tags, setTags] = useState(deck.tags.join(", "));
  const [error, setError] = useState("");
  const updateMutation = useMutation({
    mutationFn: () => decksAPI.update(deck._id, { title: title.trim(), description: description.trim(), visibility, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["decks"] }); router.push(`/decks/${deck._id}`); },
    onError: (value: Error) => setError(value.message),
  });
  function submit(event: FormEvent) { event.preventDefault(); setError(""); if (!title.trim()) { setError("Deck title is required."); return; } updateMutation.mutate(); }

  return <div className="h-full overflow-y-auto bg-[#fbf9f4] p-4 sm:p-8"><div className="mx-auto max-w-[760px]"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]" href={`/decks/${deck._id}`}><ArrowLeft className="h-4 w-4" />Back to deck</Link><form className="mt-6 rounded-[30px] border border-black/5 bg-white p-6 shadow-sm sm:p-8" onSubmit={submit}><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">Deck settings</p><h1 className="mt-2 [font-family:var(--font-outfit)] text-3xl font-extrabold">Edit deck</h1>{error && <div className="mt-5 rounded-2xl bg-[#fff0f0] p-4 text-sm font-bold text-[#a33a3a]">{error}</div>}<div className="mt-7 space-y-5"><Field label="Title"><input className={inputClass} onChange={(event) => setTitle(event.target.value)} value={title} /></Field><Field label="Description"><textarea className={`${inputClass} min-h-32 py-4`} onChange={(event) => setDescription(event.target.value)} value={description} /></Field><Field label="Visibility"><select className={inputClass} onChange={(event) => setVisibility(event.target.value as DeckVisibility)} value={visibility}><option value="private">Private</option><option value="link">Anyone with link</option><option value="public">Public</option></select></Field><Field label="Tags"><input className={inputClass} onChange={(event) => setTags(event.target.value)} placeholder="biology, exam, chapter 1" value={tags} /><p className="mt-2 text-xs text-[#9a9692]">Separate tags with commas.</p></Field></div><button className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#614db7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={updateMutation.isPending} type="submit">{updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save changes</button></form></div></div>;
}

const inputClass = "mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 font-medium outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-bold">{label}{children}</label>; }
