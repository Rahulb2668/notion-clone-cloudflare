import { useDocumentData } from "react-firebase-hooks/firestore";
import DocumentTitleComponent from "./DocumentTitleComponent";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocumentButton from "./DeleteDocumentButton";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

const Document = ({ id }: { id: string }) => {
  const [data, isLoading, error] = useDocumentData(doc(db, "documents", id));

  const isOwner = useOwner();
  return (
    <div className="flex-1 h-full p-5 bg-white rounded-lg">
      <div className="flex max-w-6xl justify-between mx-auto pb-5 gap-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading document: {error.message}</p>
        ) : (
          <DocumentTitleComponent docId={id} title={data?.title || ""} />
        )}

        {isOwner && (
          <>
            {/* Invite user */}
            <InviteUser />
            {/* Delete Document  */}
            <DeleteDocumentButton />
          </>
        )}
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-10">
        {/* Manage users */}
        <ManageUsers />
        {/* Avatars */}
        <Avatars />
      </div>

      <hr className="pb-10" />
      <Editor />
    </div>
  );
};
export default Document;
