function Branding() {
  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-12 w-12 rounded-2xl bg-[#5C6B5F] flex items-center justify-center text-white text-xl font-bold">
          IQ
        </div>

        <h1 className="text-4xl font-bold text-[#1F2937]">
          InsightIQ
        </h1>
      </div>

      <h2 className="text-6xl leading-tight font-bold text-[#1F2937]">
        Understand every
        <br />
        document.
      </h2>

      <h2 className="text-6xl leading-tight font-bold text-[#5C6B5F]">
        Discover insights.
      </h2>

      <p className="mt-8 text-xl text-gray-600 leading-9">
        AI-powered document intelligence platform that extracts,
        analyzes and lets you chat with your documents.
      </p>
    </div>
  );
}

export default Branding;