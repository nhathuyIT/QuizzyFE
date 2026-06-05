import type { Card } from "../card/card.type";

export type DeckVisibility = "public" | "private";

export interface ApiDeck {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  visibility?: DeckVisibility;
  tags?: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeckRequest {
  title: string;
  description?: string;
  visibility?: DeckVisibility;
  tags?: string[];
}

export interface UpdateDeckRequest {
  title?: string;
  description?: string;
  visibility?: DeckVisibility;
  tags?: string[];
}

export interface DeckSearchParams extends Record<string, unknown> {
  keyword?: string;
  visibility?: DeckVisibility | "";
}

export interface DeckCardsParams extends Record<string, unknown> {
  keyword?: string;
}

export interface Deck {
  id: string;
  title: string;
  description?: string;
  visibility: DeckVisibility;
  tags: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DeckCards = Card[];
