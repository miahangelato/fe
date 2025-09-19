          import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
  showAllLinks?: boolean;
}

export function Footer({ className = '', showAllLinks = true }: FooterProps) {
  return (
    <footer className={`w-full px-6 md:px-12 lg:px-16 xl:px-24 py-1 flex justify-between items-center border-t border-gray-100 mt-1 ${className}`}>
      <div className="text-xs text-gray-500">© 2025 Printalyzer. All rights reserved.</div>
      <div className="flex space-x-4">
        <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#00c2cb]">
          Privacy
        </Link>
        <Link href="/terms" className="text-xs text-gray-500 hover:text-[#00c2cb]">
          Terms
        </Link>
        {showAllLinks && (
          <>
            <Link href="/help" className="text-xs text-gray-500 hover:text-[#00c2cb]">
              Help
            </Link>
            <Link href="/contact" className="text-xs text-gray-500 hover:text-[#00c2cb]">
              Contact
            </Link>
          </>
        )}
      </div>
    </footer>
  );
}