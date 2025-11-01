import UserList from "@/components/UserList";
import WelcomeDialog from "@/components/WelcomeDialog";
import { Heading, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-14">
      {/* Hero */}
      <section className="mb-10">
        <Heading size="8" className="mb-3 tracking-tight">
          EGOV Lab Application
        </Heading>
        <Text size="4" className="text-slate-600 dark:text-slate-300">
          A Next.js + TypeScript app with both frontend UI and API routes. Radix UI
          primitives + Tailwind for styling.
        </Text>

        <div className="mt-6">
          <WelcomeDialog />
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-6 md:grid-cols-2 mb-10">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
          <Heading size="5" className="mb-2">Frontend (React)</Heading>
          <Text className="text-slate-600 dark:text-slate-300">
            Built with React and TypeScript. Accessible, composable components and responsive design.
          </Text>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
          <Heading size="5" className="mb-2">Backend (API Routes)</Heading>
          <Text className="text-slate-600 dark:text-slate-300">
            Next.js API routes with type-safe handlers for quick data fetching.
          </Text>
        </div>
      </section>

      {/* Users */}
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <UserList />
      </section>
    </main>
  );
}
