"use client";

import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Define the callback globally
    (window as any).googleTranslateElementInit = () => {
      try {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: "it",
          includedLanguages: "it,en,fr,es,de,ja,zh-CN,ar,ru,pt",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, "google_translate_element");
      } catch (e) {
        // ignore
      }
    };

    // Inject the script if not already present
    if (!document.getElementById("google-translate-script-src")) {
      const script = document.createElement("script");
      script.id = "google-translate-script-src";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }

    // MutationObserver to remove the Google Translate top bar iframe
    const observer = new MutationObserver(() => {
      // Remove the banner iframe
      document.querySelectorAll("iframe.goog-te-banner-frame").forEach((el) => el.remove());
      // Remove the skip translation banner div
      document.querySelectorAll(".goog-te-banner-frame").forEach((el) => el.remove());
      // Remove any iframe directly inserted at top of body
      document.querySelectorAll("body > iframe").forEach((el) => {
        if (el.className && el.className.includes("goog-te")) el.remove();
      });
      // Reset body top if Google set it
      if (document.body.style.top) document.body.style.top = "";
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });

    // Also check periodically
    const interval = setInterval(() => {
      document.querySelectorAll("iframe.goog-te-banner-frame").forEach((el) => el.remove());
      document.querySelectorAll(".goog-te-banner-frame").forEach((el) => el.remove());
      if (document.body.style.top) document.body.style.top = "";
    }, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .goog-te-banner-frame { display: none !important; }
        .goog-te-gadget { display: none !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-spinner-pos { display: none !important; }
        body { top: 0 !important; position: static !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
        iframe.goog-te-banner-frame { display: none !important; height: 0 !important; width: 0 !important; }
        .skiptranslate { display: none !important; }
        body > .skiptranslate { display: none !important; }
      `}} />
    </>
  );
}
