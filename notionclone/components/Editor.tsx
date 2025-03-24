"use client";

import { useRoom } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { getYjsProviderForRoom, LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import BlockNote from "./BlockNote";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";
const Editor = () => {
  const room = useRoom();
  const [darkMode, setDarkMode] = useState(false);
  const provider = getYjsProviderForRoom(room);

  if (!provider) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-end gap-2 items-center my-4">
        <TranslateDocument doc={provider.getYDoc()} />
        {/* Chat to Document AI */}
        <ChatToDocument doc={provider.getYDoc()} />
        <Button
          variant="outline"
          size="icon"
          className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-md dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-100"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
                darkMode
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-0 opacity-0"
              }`}
            />
            <Moon
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
                !darkMode
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <BlockNote
        doc={provider.getYDoc()}
        provider={provider}
        darkMode={darkMode}
      />
    </div>
  );
};
export default Editor;
