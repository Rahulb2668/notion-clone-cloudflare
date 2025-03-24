"use client";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useSelf } from "@liveblocks/react/suspense";
import stringToHexColor from "@/lib/stringToColor";

const BlockNote = ({
  doc,
  provider,
  darkMode,
}: {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
}) => {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: stringToHexColor(userInfo.email),
      },
    },
  });

  return (
    <div className="relaitve max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        theme={darkMode ? "dark" : "light"}
        editor={editor}
      />
    </div>
  );
};
export default BlockNote;
