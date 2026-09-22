"use client";

import { SocialIcon } from "@/components/public/SocialIcon";
import { OPEN_QUOTE_POPUP_EVENT } from "@/components/public/QuotePopupModal";

const tabClass =
  "flex flex-col items-center gap-2 px-2 py-4 text-xs font-semibold text-white shadow-lg transition-transform hover:-translate-x-0.5";
const labelClass = "[writing-mode:vertical-rl] rotate-180";

export function FloatingSideWidget({ phone }: { phone: string }) {
  return (
    <div className="fixed right-0 top-1/2 z-80 flex -translate-y-1/2 flex-col overflow-hidden rounded-l-lg">
      {phone && (
        <a
          href={`https://wa.me/${phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          className={`${tabClass} bg-[#25D366]`}
        >
          <SocialIcon label="WhatsApp" className="h-5 w-5 shrink-0" />
          <span className={labelClass}>WhatsApp</span>
        </a>
      )}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_QUOTE_POPUP_EVENT))}
        aria-label="Get a quotation"
        className={`${tabClass} bg-navy`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 shrink-0" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h16A1.5 1.5 0 0 1 21.5 7v9A1.5 1.5 0 0 1 20 17.5H8l-4.5 3.5V7A1.5 1.5 0 0 1 4 5.5Z" />
        </svg>
        <span className={labelClass}>Get a Quotation</span>
      </button>
    </div>
  );
}
