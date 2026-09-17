import "server-only";

interface EnquiryNotification {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
}

// Best-effort notification — a missing/invalid Resend key must never block
// the enquiry from being saved, so failures are logged, not thrown.
export async function notifyNewEnquiry(enquiry: EnquiryNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BharatTrip <onboarding@resend.dev>",
        to,
        subject: `New enquiry from ${enquiry.name}`,
        text: [
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          enquiry.phone ? `Phone: ${enquiry.phone}` : null,
          "",
          enquiry.message ?? "(no message)",
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("Resend enquiry notification failed:", await response.text());
    }
  } catch (error) {
    console.error("Resend enquiry notification failed:", error);
  }
}
