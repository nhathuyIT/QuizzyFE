import React, { useState } from "react";
import { EndpointGroup, InputField, ActionButton } from "./EndpointGroup";
import { adminAPI } from "@/services/api/admin.api";

interface Props {
  onExecute: (title: string, func: () => Promise<any>) => void;
}

export const AdminTestPanel: React.FC<Props> = ({ onExecute }) => {
  const [deckId, setDeckId] = useState("");
  const [sessionId, setSessionId] = useState("");

  return (
    <EndpointGroup title="Admin APIs" themeColor="green">
      <InputField label="Deck ID" value={deckId} onChange={setDeckId} placeholder="Enter Deck ID" />
      <InputField label="Session ID" value={sessionId} onChange={setSessionId} placeholder="Enter Study Session ID" />
      
      <div className="mt-4 space-y-2 pt-2 border-t border-green-100">
        <ActionButton 
          themeColor="green" 
          label="8. Get Admin Decks" 
          onClick={() => onExecute("GET /admin/decks", () => adminAPI.getDecks())} 
        />
        <ActionButton 
          themeColor="green" 
          label="9. Get Admin Deck by ID" 
          onClick={() => onExecute(`GET /admin/decks/${deckId}`, () => adminAPI.getDeck(deckId))} 
        />
        <ActionButton 
          themeColor="green" 
          label="10. Moderate Deck" 
          onClick={() => onExecute(`PATCH /admin/decks/${deckId}/moderation`, () => adminAPI.moderateDeck(deckId, { status: "hidden" }))} 
        />
        <ActionButton 
          themeColor="green" 
          label="11. Delete Admin Deck" 
          onClick={() => onExecute(`DELETE /admin/decks/${deckId}`, () => adminAPI.deleteDeck(deckId))} 
        />
        <ActionButton 
          themeColor="green" 
          label="12. Restore Admin Deck" 
          onClick={() => onExecute(`POST /admin/decks/${deckId}/restore`, () => adminAPI.restoreDeck(deckId))} 
        />
        <ActionButton 
          themeColor="green" 
          label="13. Admin Study Summary" 
          onClick={() => onExecute("GET /admin/study/summary", () => adminAPI.getStudySummary())} 
        />
        <ActionButton 
          themeColor="green" 
          label="14. Admin Study Sessions" 
          onClick={() => onExecute("GET /admin/study-sessions", () => adminAPI.getStudySessions())} 
        />
        <ActionButton 
          themeColor="green" 
          label="15. Admin Get Study Session" 
          onClick={() => onExecute(`GET /admin/study-sessions/${sessionId}`, () => adminAPI.getStudySession(sessionId))} 
        />
        <ActionButton 
          themeColor="green" 
          label="16. Admin Get Session Reviews" 
          onClick={() => onExecute(`GET /admin/study-sessions/${sessionId}/reviews`, () => adminAPI.getStudySessionReviews(sessionId))} 
        />
        <ActionButton 
          themeColor="green" 
          label="17. Admin Audit Logs" 
          onClick={() => onExecute("GET /admin/audit-logs", () => adminAPI.getAuditLogs())} 
        />
      </div>
    </EndpointGroup>
  );
};
