"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const Avatars = () => {
  const others = useOthers();
  const self = useSelf();

  const all = [self, ...others];
  return (
    <div className="flex  gap-2 items-center">
      <p className="font-light text-sm">
        Users currently editing this document
      </p>
      <div className="flex -space-x-5">
        {all.map((user, i) => (
          <TooltipProvider key={user.id + `${i}`}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z-50">
                  <AvatarImage src={user.info.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">
                  {self.id === user.id ? "You" : user.info.name}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
export default Avatars;
