'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

export default function WelcomeDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Learn More
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-[90vw] max-w-md max-h-[85vh] overflow-y-auto data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Welcome to EGOV Lab Application
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 dark:text-gray-300 mb-4">
            This application demonstrates the integration of Radix UI with Next.js. 
            Radix UI provides unstyled, accessible components that you can customize to match your design.
          </Dialog.Description>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p><strong>Features included:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Accordion component for user list</li>
              <li>Dialog component for modals</li>
              <li>Fully accessible and keyboard-friendly</li>
              <li>Smooth animations and transitions</li>
            </ul>
          </div>
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Got it!
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button 
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <Cross2Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
