import { Liveblocks } from "@liveblocks/node";

const privateKey = process.env.LIVEBLOCKS_PRIVATE_KEY!;

if (!privateKey) {
  throw new Error("Missing LIVEBLOCKS_PRIVATE_KEY");
}

const liveblocks = new Liveblocks({ secret: privateKey });

export default liveblocks;
