import dynamic from "next/dynamic"

const NavigationWrapper = dynamic(
  () => import("@/components/navigation-wrapper"),
  { ssr: false }
)

export default function Home() {
  return <NavigationWrapper />
}