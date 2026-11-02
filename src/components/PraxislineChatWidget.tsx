"use client";

import { useEffect } from "react";

export default function PraxislineChatWidget() {
  useEffect(() => {
    // Avoid adding the widget more than once.
    if (document.querySelector("script[data-praxisline-widget]")) return;

    const script = document.createElement("script");
    script.src =
      
  "https://voiceflow-ai-web.vercel.app/praxisline-widget.js";
    script.dataset.businessId = "275434f1-6e3a-4d1f-8bef-582db10fd491";
    script.dataset.praxislineWidget = "true";
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return null;
}