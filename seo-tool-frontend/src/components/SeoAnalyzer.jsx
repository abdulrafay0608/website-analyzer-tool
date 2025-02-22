import React, { useState } from "react";
import axios from "axios";
import SeoReport from "./SeoReport";

const SeoAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeWebsite = async () => {
    setReport(null);
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/analyze`,
        {
          url,
        }
      );
      setReport(response.data);
    } catch (err) {
      setError("Failed to analyze the website. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">SEO Analyzer</h1>

      {/* Input Form */}
      <div className="flex space-x-2">
        <input
          type="url"
          placeholder="Enter website URL"
          className="w-full p-2 border rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={analyzeWebsite}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Loading Indicator */}
      {loading && <p className="mt-4 text-gray-600">Analyzing website...</p>}

      {/* SEO Report */}
      <SeoReport report={report} />
    </div>
  );
};

export default SeoAnalyzer;
