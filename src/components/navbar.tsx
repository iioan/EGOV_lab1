"use client";

import React, { useState } from "react";

import Image from "next/image";
import {Heading} from "@radix-ui/themes";

export const Navbar = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      const response = await fetch('/api/payments-report');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate report');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'payments-report.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Eroare la generarea raportului: ${errorMessage}`);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className="sm:h-22 px-32 flex items-center justify-between bg-black/10"
      >
        <a href="#" title="My product">
          <Image src="/upb_logo.png"
                 width={80}
                 height={80}
                 alt="Picture of the author"/>
        </a>
        <div>
          <Heading className="text-xl md:text-xl font-bold">
            Plată taxe universitate
          </Heading>
        </div>
        <div className="gap-3 items-center hidden md:flex">
          <a
            href="#"
            className="inline-flex px-5 py-2 blink-text-primary hover:bg-blinkGray400 dark:hover:bg-blinkGray800 rounded-full"
          >
            Formular
          </a>
          <a
            href="/payments"
            className="inline-flex px-5 py-2 blink-text-primary bg-blinkGray400 hover:bg-blinkGray500 dark:bg-blinkGray800 dark:hover:bg-blinkGray700 rounded-full"
          >
            Plati
          </a>
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="inline-flex px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-full transition-colors duration-200"
            title="Descarcă raport PDF cu statistici"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Se generează...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </>
            )}
          </button>
        </div>
      </nav>
      {/* Error notification */}
      {error && (
        <div 
          className="fixed top-4 right-4 z-50 max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg"
          role="alert"
        >
          <div className="flex items-start">
            <svg className="flex-shrink-0 w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Eroare</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto -mx-1.5 -my-1.5 p-1.5 hover:bg-red-200 rounded-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
