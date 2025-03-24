"use server";
import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export const createNewDocument = async () => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();

  if (!userId) return redirectToSignIn();

  // Create a new document

  const documentCollectionRef = adminDb.collection("documents");

  const docRef = await documentCollectionRef.add({
    title: "New Doc",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims.email)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims.email,
      roomId: docRef.id,
      role: "owner",
      createdAt: new Date(),
    });

  return { docId: docRef.id };
};

export const deleteDocument = async (
  roomId: string
): Promise<{ success: boolean }> => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();

  if (!userId) return redirectToSignIn();

  try {
    // delete the document itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    // delete each room's reference in the users collection
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const inviteUserToRoom = async (
  roomId: string,
  email: string
): Promise<{ success: boolean }> => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();

  if (!userId) return redirectToSignIn();

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        roomId,
        role: "editor",
        createdAt: new Date(),
      });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const removeUserFromDocument = async (roomId: string, email: string) => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();

  if (!userId) return redirectToSignIn();

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
