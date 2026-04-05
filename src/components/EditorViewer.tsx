"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import { useEffect } from "react";
import dynamic from "next/dynamic";

interface Props {
  content: string;
  className?: string;
}

function EditorViewerContent({ content, className }: Props) {
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (!content) return;

    try {
      const parsed = JSON.parse(content);
      editor.replaceBlocks(editor.document, parsed);
    } catch (e) {
      console.error("Invalid BlockNote JSON", e);
    }
  }, [content, editor]);

  return (
    <div className={className}>
      <div className="[&_div]:bg-transparent!">
        <BlockNoteView
          editor={editor}
          theme={lightDefaultTheme}
          editable={false}
        />
      </div>
    </div>
  );
}

const EditorViewer = dynamic(() => Promise.resolve(EditorViewerContent), {
  ssr: false,
});

export default EditorViewer;
