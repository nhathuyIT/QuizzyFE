export interface ApiCard {
  id?: string;
  _id?: string;
  deckId: string;
  front: string;
  back: string;
  position?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCardRequest {
  deckId: string;
  front: string;
  back: string;
  position?: number;
}

export interface CreateBulkCardsRequest {
  deckId: string;
  cards: Array<{
    front: string;
    back: string;
    position?: number;
  }>;
}

export interface UpdateCardRequest {
  front?: string;
  back?: string;
  position?: number;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}
