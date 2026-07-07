import React, { useState } from "react";
import { EndpointGroup, InputField, ActionButton } from "./EndpointGroup";
import { chatbotAPI } from "@/services/api/chatbot.api";

interface Props {
  onExecute: (title: string, func: () => Promise<unknown>) => void;
}

export const ChatbotTestPanel: React.FC<Props> = ({ onExecute }) => {
  const [documentId, setDocumentId] = useState("");
  const [title, setTitle] = useState("");

  return (
    <EndpointGroup title="Chatbot APIs" themeColor="purple">
      <InputField label="Document ID" value={documentId} onChange={setDocumentId} placeholder="Enter Academic Document ID" />
      <InputField label="Title (Optional)" value={title} onChange={setTitle} placeholder="Enter Title for Flashcards" />
      
      <div className="mt-4 space-y-2 pt-2 border-t border-purple-100">
        <ActionButton 
          themeColor="purple" 
          label="18. Generate from Academic Doc" 
          onClick={() => onExecute("POST /chatbot/generate/academic-document", () => chatbotAPI.generateFromAcademicDocument({ documentId, title }))} 
        />
      </div>
    </EndpointGroup>
  );
};
