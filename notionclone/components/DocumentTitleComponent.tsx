import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const DocumentTitleComponent = ({
  docId,
  title,
}: {
  docId: string;
  title: string;
}) => {
  const [input, setInput] = useState(title);
  const [isUpdating, startTransition] = useTransition();

  // Update local state when prop changes
  useEffect(() => {
    setInput(title);
  }, [title]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && input !== title) {
      startTransition(async () => {
        try {
          await updateDoc(doc(db, "documents", docId), {
            title: input,
          });
          console.log("Document title updated successfully");
        } catch (error) {
          console.error("Error updating document title:", error);
          // Optionally revert to previous title on error
          setInput(title);
        }
      });
    }
  };
  return (
    <form onSubmit={updateTitle} className="flex gap-2 flex-1">
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update"}
      </Button>
    </form>
  );
};
export default DocumentTitleComponent;
