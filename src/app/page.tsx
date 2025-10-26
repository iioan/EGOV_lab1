import UserList from '@/components/UserList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            EGOV Lab Application
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            A simple Next.js application with TypeScript, featuring both frontend and backend capabilities.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Frontend (React)
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Built with React and TypeScript, featuring modern UI components and responsive design.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Backend (API Routes)
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Powered by Next.js API routes with TypeScript for type-safe backend development.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <UserList />
          </div>
        </div>
      </main>
    </div>
  );
}
