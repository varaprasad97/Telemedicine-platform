import React, { useState } from 'react';
import { FaRobot, FaSpinner } from 'react-icons/fa';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ symptoms })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Symptom Checker
          </h1>
          <p className="text-lg text-gray-600">
            Describe your symptoms and get an AI-powered analysis
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-medium text-gray-700"
              >
                Describe your symptoms
              </label>
              <textarea
                id="symptoms"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Example: I have been experiencing fever, cough, and fatigue for the past 3 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaRobot className="mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Analysis Results
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Possible Conditions
                  </h3>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    {analysis.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Recommended Actions
                  </h3>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Note: This is an AI-powered analysis and should not replace
                    professional medical advice. Please consult a healthcare
                    provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;