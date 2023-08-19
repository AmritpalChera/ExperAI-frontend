import useSessionProvider from "@/hooks/useSessionProvider"

export default function Startup({ children }: any) {
  useSessionProvider();
  return children
}