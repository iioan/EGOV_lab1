import { Heading, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-14">
      {/* Hero */}
      <section className="mb-10">
        <Heading size="8" className="mb-3 tracking-tight">
          EGOV Lab Application
        </Heading>
        <Text size="4" className="text-slate-600">
          A Next.js + TypeScript app with both frontend UI and API routes. Radix UI
          primitives + Tailwind for styling.
        </Text>
      </section>
    </main>
  );
}