"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenText, Loader2, Plus } from "lucide-react";
import type { Card } from "@/services/api";
import type { MatchSize, PracticeMode } from "../types";
import { buildStudyOptions, pairCards, stableShuffle } from "../utils";
import { DeckFlashcardMode } from "./DeckFlashcardMode";
import { DeckMatchMode } from "./DeckMatchMode";
import { DeckStudyMode } from "./DeckStudyMode";
import { PracticeModeTabs } from "./PracticeModeTabs";

export function DeckPracticeSurface({
  cards,
  deckId,
  isLoading,
  isOwner,
}: {
  cards: Card[];
  deckId: string;
  isLoading: boolean;
  isOwner: boolean;
}) {
  const practiceRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<PracticeMode>("flashcard");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyAnswer, setStudyAnswer] = useState("");
  const [studyChecked, setStudyChecked] = useState(false);
  const [matchSize, setMatchSize] = useState<MatchSize>("half");
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [matchChecked, setMatchChecked] = useState(false);

  const currentIndex = cards.length ? Math.min(cardIndex, cards.length - 1) : 0;
  const currentCard = cards[currentIndex];
  const matchCards = useMemo(() => {
    const size = matchSize === "half" ? Math.max(1, Math.ceil(cards.length / 2)) : cards.length;
    return cards.slice(0, size);
  }, [cards, matchSize]);
  const matchDefinitions = useMemo(() => stableShuffle(matchCards), [matchCards]);
  const pairedMatchCount = matchCards.filter((card) => matches[card._id]).length;
  const studyOptions = useMemo(() => buildStudyOptions(cards, currentCard), [cards, currentCard]);

  function focusMode(mode: PracticeMode) {
    setActiveMode(mode);
    setIsFlipped(false);
    setStudyAnswer("");
    setStudyChecked(false);
    requestAnimationFrame(() => {
      practiceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function moveCard(direction: -1 | 1) {
    if (!cards.length) return;
    const nextIndex = (currentIndex + direction + cards.length) % cards.length;
    setCardIndex(nextIndex);
    setIsFlipped(false);
    setStudyAnswer("");
    setStudyChecked(false);
  }

  function chooseStudyAnswer(answer: string) {
    if (studyChecked) return;
    setStudyAnswer(answer);
  }

  function resetMatchBoard(size: MatchSize = matchSize) {
    setMatchSize(size);
    setSelectedTermId(null);
    setSelectedDefinitionId(null);
    setMatches({});
    setMatchChecked(false);
  }

  function chooseTerm(cardId: string) {
    if (matchChecked) return;
    if (selectedDefinitionId) {
      setMatches((current) => pairCards(current, cardId, selectedDefinitionId));
      setSelectedTermId(null);
      setSelectedDefinitionId(null);
      return;
    }
    setSelectedTermId((current) => (current === cardId ? null : cardId));
  }

  function chooseDefinition(cardId: string) {
    if (matchChecked) return;
    if (selectedTermId) {
      setMatches((current) => pairCards(current, selectedTermId, cardId));
      setSelectedTermId(null);
      setSelectedDefinitionId(null);
      return;
    }
    setSelectedDefinitionId((current) => (current === cardId ? null : cardId));
  }

  return (
    <section ref={practiceRef} className="mt-6 scroll-mt-6">
      <PracticeModeTabs activeMode={activeMode} onChange={focusMode} />

      <div className="mt-5 rounded-[30px] border border-black/5 bg-white p-4 shadow-[0_20px_70px_rgba(27,28,25,0.08)] sm:p-6">
        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#614db7]" />
          </div>
        ) : cards.length ? (
          <>
            {activeMode === "flashcard" && currentCard && (
              <DeckFlashcardMode
                card={currentCard}
                currentIndex={currentIndex}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped((value) => !value)}
                onMove={moveCard}
                total={cards.length}
              />
            )}
            {activeMode === "study" && currentCard && (
              <DeckStudyMode
                answer={studyAnswer}
                card={currentCard}
                checked={studyChecked}
                currentIndex={currentIndex}
                onCheck={() => setStudyChecked(true)}
                onChoose={chooseStudyAnswer}
                onNext={() => moveCard(1)}
                options={studyOptions}
                total={cards.length}
              />
            )}
            {activeMode === "match" && (
              <DeckMatchMode
                checked={matchChecked}
                definitions={matchDefinitions}
                matchSize={matchSize}
                matches={matches}
                onCheck={() => setMatchChecked(true)}
                onChooseDefinition={chooseDefinition}
                onChooseTerm={chooseTerm}
                onReset={() => resetMatchBoard()}
                onSizeChange={resetMatchBoard}
                pairedCount={pairedMatchCount}
                selectedDefinitionId={selectedDefinitionId}
                selectedTermId={selectedTermId}
                terms={matchCards}
                totalCards={cards.length}
              />
            )}
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#cabeff] p-10 text-center">
            <BookOpenText className="mx-auto h-9 w-9 text-[#614db7]" />
            <p className="mt-4 font-bold">This deck has no cards yet.</p>
            {isOwner && (
              <Link
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#614db7] px-5 py-3 text-sm font-bold text-white"
                href={`/flashcards?deckId=${deckId}`}
              >
                <Plus className="h-4 w-4" />
                Add cards
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
