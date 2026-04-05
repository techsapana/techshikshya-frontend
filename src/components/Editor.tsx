"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useRef } from "react";
import { lightDefaultTheme } from "@blocknote/mantine";
import dynamic from "next/dynamic";

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

// Lazy load editor content with ssr disabled
const EditorContent = dynamic(() => Promise.resolve(EditorContentComponent), {
  ssr: false,
});

function EditorContentComponent({
  value = "",
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();
  const hasLoadedContent = useRef(false);

  // Load content only once on mount
  useEffect(() => {
    if (!editor || hasLoadedContent.current) return;

    if (value) {
      try {
        const blocks = JSON.parse(value);
        editor.replaceBlocks(editor.document, blocks);
        hasLoadedContent.current = true;
      } catch {
        console.warn("Invalid JSON in editor value");
        hasLoadedContent.current = true;
      }
    } else {
      hasLoadedContent.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // Setup change listener
  useEffect(() => {
    if (!editor) return;

    editor.onEditorContentChange(() => {
      if (onChange) {
        const content = JSON.stringify(editor.document);
        onChange(content);
      }
    });
  }, [editor, onChange]);

  // Renders the editor instance using a React component.
  return (
    <div className="w-full min-h-96 border-2 border-gray-300 rounded-lg overflow-hidden">
      <BlockNoteView editor={editor} theme={lightDefaultTheme} />
    </div>
  );
}

// Our <Editor> component
export default function Editor(props: EditorProps) {
  return (
    <>
      <EditorContent {...props} />
    </>
  );
}
