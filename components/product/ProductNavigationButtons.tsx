export function ProductNavigationButtons() {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pt-2 md:pt-3">
      <button
        type="button"
        onClick={() => scrollToSection("capture-notes")}
        className="block h-10 text-center text-lg rounded-none font-extralight text-[#626262] underline decoration-[#626262] underline-offset-5 hover:text-[#626262] transition-colors cursor-pointer"
      >
        Capture notes &gt;
      </button>
      <button
        type="button"
        onClick={() => scrollToSection("specifications")}
        className="block h-10 text-center text-lg rounded-none font-extralight text-[#626262] underline decoration-[#626262] underline-offset-5 hover:text-[#626262] transition-colors cursor-pointer"
      >
        Specifications &gt;
      </button>
    </div>
  );
}
