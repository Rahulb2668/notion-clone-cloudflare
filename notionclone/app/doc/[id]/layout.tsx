import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  const { id } = await params;
  if (!userId) return redirectToSignIn();
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
export default DocLayout;
