"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { removeUserFromDocument } from "@/actions/actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react";
import useOwner from "@/lib/useOwner";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";

const ManageUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      if (!user) return;

      const { success } = await removeUserFromDocument(room.id, userId);

      if (success) {
        toast.success("User removed successfully");
      } else {
        toast.error("Failed to remove user");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        asChild
        className="bg-white text-black border border-black hover:bg-slate-100 hover:border-slate-500"
      >
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage users with access</DialogTitle>
          <DialogDescription>
            Below are the users with access to this document
          </DialogDescription>
        </DialogHeader>
        <div className="my-1"></div>
        <div className="space-y-2">
          {usersInRoom?.docs.map((doc) => {
            // console.log(
            //   isOwner,
            //   doc.data().userId,
            //   user?.emailAddresses[0].emailAddress.toString()
            // );
            return (
              <div
                key={doc.data().userId}
                className="flex items-center justify-between gap-2 "
              >
                <p className="font-light">
                  {doc.data().userId ===
                  user?.emailAddresses[0].emailAddress.toString()
                    ? "You"
                    : doc.data().userId}
                </p>
                <div className="space-x-2">
                  <Button variant={"outline"} className="min-w-20">
                    {doc.data().role === "owner" ? "Owner" : "Editor"}
                  </Button>
                  {isOwner &&
                    doc.data().userId !==
                      user?.emailAddresses[0].emailAddress.toString() && (
                      <Button
                        variant={"destructive"}
                        onClick={() => handleDelete(doc.data().userId)}
                        disabled={isPending}
                        size={"sm"}
                      >
                        {isPending ? "Removing..." : "Remove"}
                      </Button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ManageUsers;
