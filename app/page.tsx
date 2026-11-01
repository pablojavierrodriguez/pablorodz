import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/hero'
import { SystemsSection } from '@/components/systems-section'
import { ChronicleSection } from '@/components/chronicle-section'
import { PrinciplesSection } from '@/components/principles-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { TelemetryBar } from '@/components/telemetry-bar'
import { CommandPalette } from '@/components/command-palette'
import { ConsoleEasterEgg } from '@/components/console-easter-egg'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pb-10">
        <Hero />
        <SystemsSection />
        <ChronicleSection />
        <PrinciplesSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
      <TelemetryBar />
      <CommandPalette />
      <ConsoleEasterEgg />
    </>
  )
}
