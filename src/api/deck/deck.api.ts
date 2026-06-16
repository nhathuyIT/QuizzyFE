import { mapApiCard } from "../card/card.api";
import type { ApiCard } from "../card/card.type";
import { httpClient } from "../httpClient.api";
import type {
  ApiDeck,
  DeckCardsParams,
  DeckSearchParams,
  CreateDeckRequest,
  Deck,
  DeckCards,
  UpdateDeckRequest,
} from "./deck.type";

export type {
  ApiDeck,
  DeckCardsParams,
  DeckSearchParams,
  CreateDeckRequest,
  Deck,
  DeckCards,
  DeckVisibility,
  UpdateDeckRequest,
} from "./deck.type";

export const mapApiDeck = (raw: ApiDeck): Deck => ({
  id: raw.id || raw._id || "",
  title: raw.title,
  description: raw.description,
  visibility: raw.visibility || "private",
  tags: raw.tags || [],
  userId: raw.userId,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const searchDecks = async (
  params: DeckSearchParams = {}
): Promise<Deck[]> => {
  const response = await httpClient.get<ApiDeck[]>({
    url: "/v1/decks",
    params,
  });

  return (response ?? []).map(mapApiDeck);
};

export const getDeckById = async (id: string): Promise<Deck> => {
  const response = await httpClient.get<ApiDeck>({
    url: `/v1/decks/${id}`,
  });

  if (!response) throw new Error("No response from server");
  return mapApiDeck(response);
};

export const createDeck = async (data: CreateDeckRequest): Promise<Deck> => {
  const response = await httpClient.post<ApiDeck, CreateDeckRequest>({
    url: "/v1/decks",
    data,
  });

  if (!response) throw new Error("No response from server");
  return mapApiDeck(response);
};

export const updateDeck = async (
  id: string,
  data: UpdateDeckRequest
): Promise<Deck> => {
  const response = await httpClient.patch<ApiDeck, UpdateDeckRequest>({
    url: `/v1/decks/${id}`,
    data,
  });

  if (!response) throw new Error("No response from server");
  return mapApiDeck(response);
};

export const getDeckCards = async (
  deckId: string,
  params: DeckCardsParams = {}
): Promise<DeckCards> => {
  const response = await httpClient.get<ApiCard[]>({
    url: `/v1/decks/${deckId}/cards`,
    params,
  });

  return (response ?? []).map(mapApiCard);
};

export const getAll = searchDecks;
export const getById = getDeckById;
export const create = createDeck;
export const update = updateDeck;
