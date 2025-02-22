import React from "react";

const SeoReport = ({ report }) => {
  if (!report) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        SEO Analysis Report
      </h2>

      {/* Basic Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">Basic Details</h3>
        <p>
          <strong>Website URL:</strong>{" "}
          <a
            href={report.url}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {report.url}
          </a>
        </p>
        <p>
          <strong>Title:</strong> {report.basic.title}
        </p>
        <p>
          <strong>Meta Description:</strong> {report.basic.metaDescription}
        </p>
        <p>
          <strong>Meta Keywords:</strong> {report.basic.metaKeywords}
        </p>
        <p>
          <strong>HTML Lang:</strong> {report.basic.htmlLang}
        </p>
        <p>
          <strong>Charset:</strong> {report.basic.charset}
        </p>
      </div>

      {/* Social Meta Tags */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">
          Social Meta Tags
        </h3>
        <p>
          <strong>OG Title:</strong> {report.socialMeta.ogTitle}
        </p>
        <p>
          <strong>OG Description:</strong> {report.socialMeta.ogDescription}
        </p>
        <p>
          <strong>Twitter Title:</strong> {report.socialMeta.twitterTitle}
        </p>
        <p>
          <strong>Twitter Description:</strong>{" "}
          {report.socialMeta.twitterDescription}
        </p>
      </div>

      {/* Indexability */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">Indexability</h3>
        <p>
          <strong>Robots Meta:</strong> {report.indexability.robotsMeta}
        </p>
        <p>
          <strong>Canonical Link:</strong>{" "}
          <a
            href={report.indexability.canonicalLink}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {report.indexability.canonicalLink}
          </a>
        </p>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-blue-600">H1 Tags</h3>
          <ul className="list-disc pl-5">
            {report.headers.h1Tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-blue-600">H2 Tags</h3>
          <ul className="list-disc pl-5">
            {report.headers.h2Tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-blue-600">H3 Tags</h3>
          <ul className="list-disc pl-5">
            {report.headers.h3Tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Links */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">Links</h3>
        <p>
          <strong>Total Links Found:</strong> {report.links.totalLinks.length}
        </p>
        <p>
          <strong>Broken Links:</strong> {report.links.brokenLinks.length}
        </p>
      </div>

      {/* Performance */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">Performance</h3>
        <p>
          <strong>Server Response Time:</strong>{" "}
          {report.performance.serverResponseTime} ms
        </p>
      </div>

      {/* Rendering */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">Rendering</h3>
        <p>
          <strong>Clickable Elements Count:</strong>{" "}
          {report.rendering.clickableElementsCount}
        </p>

        {/* Mobile Screenshot */}
        {report.rendering.mobileViewScreenshot && (
          <div className="mt-4">
            <h3 className="font-semibold">Mobile View Screenshot</h3>
            <img
              src={`data:image/png;base64,${report.rendering.mobileViewScreenshot}`}
              alt="Mobile View"
              className="border rounded shadow-sm mt-2 max-h-80 object-contain"
            />
          </div>
        )}
      </div>

      {/* Assets Minification */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600">
          Assets Minification
        </h3>
        <p>
          <strong>JS Minified:</strong>{" "}
          {report.assets.jsMinified ? "Yes ✅" : "No ❌"}
        </p>
        <p>
          <strong>CSS Minified:</strong>{" "}
          {report.assets.cssMinified ? "Yes ✅" : "No ❌"}
        </p>
      </div>
    </div>
  );
};

export default SeoReport;
