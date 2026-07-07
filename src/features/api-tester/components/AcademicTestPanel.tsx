import React, { useState } from "react";
import { EndpointGroup, InputField, ActionButton } from "./EndpointGroup";
import { academicAPI } from "@/services/api/academic.api";

interface Props {
  onExecute: (title: string, func: () => Promise<unknown>) => void;
}

export const AcademicTestPanel: React.FC<Props> = ({ onExecute }) => {
  const [deptId, setDeptId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [docId, setDocId] = useState("");

  return (
    <EndpointGroup title="Academic APIs" themeColor="blue">
      <InputField label="Department ID" value={deptId} onChange={setDeptId} placeholder="Enter Dept ID to fetch subjects" />
      <InputField label="Subject ID" value={subjectId} onChange={setSubjectId} placeholder="Enter Subject ID to fetch docs" />
      <InputField label="Document ID" value={docId} onChange={setDocId} placeholder="Enter Document ID to modify" />
      
      <div className="mt-4 space-y-2 pt-2 border-t border-blue-100">
        <ActionButton 
          themeColor="blue" 
          label="1. Get Departments" 
          onClick={() => onExecute("GET /academic/departments", () => academicAPI.getDepartments())} 
        />
        <ActionButton 
          themeColor="blue" 
          label="2. Get Subjects by Dept" 
          onClick={() => onExecute(`GET /academic/.../subjects (${deptId})`, () => academicAPI.getSubjects(deptId))} 
        />
        <ActionButton 
          themeColor="blue" 
          label="3. Get Documents by Subject" 
          onClick={() => onExecute(`GET /academic/.../documents (${subjectId})`, () => academicAPI.getDocumentsBySubject(subjectId))} 
        />
        <ActionButton 
          themeColor="blue" 
          label="4. Get My Documents" 
          onClick={() => onExecute("GET /academic/documents/my", () => academicAPI.getMyDocuments())} 
        />
        <ActionButton 
          themeColor="blue" 
          label="5. Create Document" 
          onClick={() => onExecute("POST /academic/documents", () => academicAPI.createDocument({ 
            title: "Test Upload", 
            subjectId: subjectId || "placeholder-id", 
            fileUrl: "http://test.com", 
            fileName: "test.pdf", 
            fileType: "pdf", 
            fileSize: 1024, 
            storagePath: "/test.pdf" 
          }))} 
        />
        <ActionButton 
          themeColor="blue" 
          label="6. Delete Document" 
          onClick={() => onExecute(`DELETE /academic/documents/${docId}`, () => academicAPI.deleteDocument(docId))} 
        />
        <ActionButton 
          themeColor="blue" 
          label="7. Increment Download" 
          onClick={() => onExecute(`PATCH /academic/documents/${docId}/download-count`, () => academicAPI.incrementDownloadCount(docId))} 
        />
      </div>
    </EndpointGroup>
  );
};
