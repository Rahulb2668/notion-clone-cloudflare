"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { inviteUserToRoom } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";

const InviteUserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const path = usePathname();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = path.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToRoom(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User Invited successfully to the room");
      } else {
        toast.error("Failed to Invite user to the room");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        asChild
        className="bg-white text-black border border-black hover:bg-slate-100 hover:border-slate-500"
      >
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user to the document</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite to this document
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email of the user"
            required
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isPending || !email}
            className="w-full"
          >
            {isPending ? "Inviting" : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default InviteUserButton;
