"use client";

import { useCollection } from "react-firebase-hooks/firestore";
import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { RoomDocument } from "@/types/types";
import SidebarOptions from "./SidebarOptions";

const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].emailAddress)
      )
  );
  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, current) => {
        const roomData = current.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: current.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: current.id,
            ...roomData,
          });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );
    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />

      <div className="flex flex-col space-y-4 md:max-w-36 py-4">
        {/* My Documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No Documents Found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupedData.owner.map((doc: RoomDocument) => (
              <SidebarOptions
                href={`/doc/${doc.id}`}
                id={doc.id}
                key={doc.id}
              />
            ))}
          </>
        )}

        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with me
            </h2>
            {groupedData.editor.map((doc: RoomDocument) => (
              <SidebarOptions
                href={`/doc/${doc.id}`}
                id={doc.id}
                key={doc.id}
              />
            ))}
          </>
        )}
      </div>

      {/* Shared with me */}

      {/* Trash */}
      {/* List ... */}
    </>
  );

  return (
    <div className="p-2 md:p-5 relative bg-gray-200 ">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opactity-30 rounded-lg " size={40} />
          </SheetTrigger>
          <SheetContent side={"left"} aria-describedby="Menu bar">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription>Menu Options</SheetDescription>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
};
export default Sidebar;
