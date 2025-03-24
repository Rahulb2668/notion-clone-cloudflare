"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [_, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const cursor = { x: e.pageX, y: e.pageY };
    updateMyPresence({ cursor });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };
  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others
        .filter((other) => other.presence.cursor)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
            info={info}
          />
        ))}
      {children}
    </div>
  );
}
export default LiveCursorProvider;
