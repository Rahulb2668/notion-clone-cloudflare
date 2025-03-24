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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import Markdown from "react-markdown";
type Language =
  | "english"
  | "arabic"
  | "chinese"
  | "french"
  | "german"
  | "hindi"
  | "italian"
  | "japanese"
  | "korean"
  | "portuguese"
  | "russian"
  | "spanish"
  | "turkish";

const language: Language[] = [
  "english",
  "arabic",
  "chinese",
  "french",
  "german",
  "hindi",
  "italian",
  "japanese",
  "korean",
  "portuguese",
  "russian",
  "spanish",
  "turkish",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [targetLanguage, setTargetLanguage] = useState<Language>();
  const [summary, setSummary] = useState("");

  const handelTranslateDocument = async (e: FormEvent) => {
    e.preventDefault();

    if (!process.env.NEXT_PUBLIC_BASE_URL)
      throw new Error("BASE URL NOT DEFINED!!");

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/translatedocument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentData, targetLanguage }),
          }
        );

        if (!response.ok) {
          toast.loading("Sorry Something went wrong");
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const { translated_text } = await response.json();
        setSummary(translated_text);

        toast.success("Document Successfully translated");
      } catch (error) {
        toast.error("Something went wrong !");
        console.error("Failed to translate document:", error);
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
          <LanguagesIcon /> Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the document</DialogTitle>
          <DialogDescription>
            Select from the language below to translate the document
          </DialogDescription>
          <hr className="my-2"></hr>
        </DialogHeader>
        {summary && (
          <div className="flex flex-col max-h-96 items-start gap-2 p-5 bg-gray-100 overflow-y-auto rounded-sm">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                AI {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>
            <div>{isPending ? "Thinking" : <Markdown>{summary}</Markdown>}</div>
          </div>
        )}
        <form onSubmit={handelTranslateDocument} className="flex gap-4">
          <Select
            value={targetLanguage}
            onValueChange={(value: Language) => setTargetLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {language.map((language, index) => (
                <SelectItem key={index} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isPending || !targetLanguage}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default TranslateDocument;
