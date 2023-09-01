import Pricing from "@/components/Pricing";
import Sidenav from "@/components/Sidenav";

export default function PricingPage() {
  return (
    <div>
      <Sidenav />
      <main className="lg:pl-72">
        <Pricing />
       </main>
    </div>
  )
}