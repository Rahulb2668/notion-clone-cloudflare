"use client";
import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BotIcon, MessageSquareText } from "lucide-react";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition, ChangeEvent } from "react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { Input } from "./ui/input";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [asnwer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");

  const handelChattoDocument = async (e: FormEvent) => {
    e.preventDefault();

    setQuestion(input);
    if (!process.env.NEXT_PUBLIC_BASE_URL)
      throw new Error("BASE URL NOT DEFINED!!");

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chattodocument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentData, question }),
          }
        );

        const { message } = await response.json();
        setInput("");
        setAnswer(message);
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Failed to chat with the agent:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        asChild
        className="bg-white text-black border border-black hover:bg-slate-100 hover:border-slate-500"
      >
        <DialogTrigger>
          <MessageSquareText /> Chat to Document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask your question</DialogTitle>
          <DialogDescription>
            Ask your question about the document with AI
          </DialogDescription>
          <hr className="my-2"></hr>
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>
        {asnwer && (
          <div className="flex flex-col max-h-96 items-start gap-2 p-5 bg-gray-100 overflow-y-auto rounded-sm">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                AI {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>
            <div>
              {isPending ? "Thinking..." : <Markdown>{asnwer}</Markdown>}
            </div>
          </div>
        )}
        <form onSubmit={handelChattoDocument} className="flex gap-4">
          <Input
            type="test"
            placeholder="Ask your question"
            required
            className="w-full"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
          />
          <Button type="submit" disabled={isPending || !input}>
            {isPending ? "Thinking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ChatToDocument;
