import LiveBlocksProvider from "@/components/LiveBlocksProvider";

const Pagelayout = ({ children }: { children: React.ReactNode }) => {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
};
export default Pagelayout;
