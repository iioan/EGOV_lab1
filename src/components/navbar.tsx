"use client";

import React, { useState } from "react";

import Image from "next/image";
import {Heading} from "@radix-ui/themes";

export const Navbar = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
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
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Eroare la generarea raportului. Vă rugăm încercați din nou.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
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
  );
};
