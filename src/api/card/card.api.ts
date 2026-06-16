import { httpClient } from "../httpClient.api";
import type {
  ApiCard,
  Card,
  CreateBulkCardsRequest,
  CreateCardRequest,
  UpdateCardRequest,
} from "./card.type";

export type {
  ApiCard,
  Card,
  CreateBulkCardsRequest,
  CreateCardRequest,
  UpdateCardRequest,
} from "./card.type";

export const mapApiCard = (raw: ApiCard): Card => ({
  id: raw.id || raw._id || "",
  deckId: raw.deckId,
  front: raw.front,
  back: raw.back,
  position: raw.position ?? 0,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const getAllCards = async (): Promise<Card[]> => {
  const response = await httpClient.get<ApiCard[]>({
    url: "/v1/cards",
  });

  return (response ?? []).map(mapApiCard);
};

export const getCardById = async (id: string): Promise<Card> => {
  const response = await httpClient.get<ApiCard>({
    url: `/v1/cards/${id}`,
  });

  if (!response) throw new Error("No response from server");
  return mapApiCard(response);
};

export const getCardsByDeck = async (deckId: string): Promise<Card[]> => {
  const response = await httpClient.get<ApiCard[]>({
    url: `/v1/cards/deck/${deckId}`,
  });

  return (response ?? []).map(mapApiCard);
};

export const createCard = async (data: CreateCardRequest): Promise<Card> => {
  const response = await httpClient.post<ApiCard, CreateCardRequest>({
    url: "/v1/cards",
    data,
  });

  if (!response) throw new Error("No response from server");
  return mapApiCard(response);
};

export const createBulkCards = async (
  data: CreateBulkCardsRequest
): Promise<Card[]> => {
  const response = await httpClient.post<ApiCard[], CreateBulkCardsRequest>({
    url: "/v1/cards/bulk",
    data,
  });

  return (response ?? []).map(mapApiCard);
};

export const updateCard = async (
  id: string,
  data: UpdateCardRequest
): Promise<Card> => {
  const response = await httpClient.patch<ApiCard, UpdateCardRequest>({
    url: `/v1/cards/${id}`,
    data,
  });

  if (!response) throw new Error("No response from server");
  return mapApiCard(response);
};

export const deleteCard = async (id: string): Promise<void> => {
  await httpClient.delete<void>({
    url: `/v1/cards/${id}`,
  });
};

export const getAll = getAllCards;
export const getById = getCardById;
export const create = createCard;
export const bulkCreate = createBulkCards;
export const update = updateCard;
