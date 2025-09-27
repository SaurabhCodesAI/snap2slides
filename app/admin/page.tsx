'use client';

import { useState, useEffect } from 'react';

interface APIStatus {
  id: string;
  type: 'gemini' | 'perplexity';
  isActive: boolean;
  errorCount: number;
  lastError?: string;
  lastErrorTime?: Date;
  lastSuccessTime?: Date;
}

interface APIStatusSummary {
  total: number;
  active: number;
  inactive: number;
  gemini: APIStatus[];
  perplexity: APIStatus[];
  details: APIStatus[];
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<APIStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch API status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetAPI = async (apiId: string) => {
    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', apiId }),
      });
      
      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to reset API:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isActive: boolean, errorCount: number) => {
    if (!isActive) return 'bg-red-100 text-red-800';
    if (errorCount > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (isActive: boolean, errorCount: number) => {
    if (!isActive) return '❌';
    if (errorCount > 0) return '⚠️';
    return '✅';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading API Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 ios-safe">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mobile-stack">
          <div className="mobile-full">
            <h1 className="text-3xl font-bold text-gray-900">API Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your API endpoints</p>
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mobile-full"
          >
            <div className={`w-4 h-4 border-2 border-current border-t-transparent rounded-full ${refreshing ? 'animate-spin' : ''}`}></div>
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total APIs</p>
                <p className="text-2xl font-bold text-gray-900">{status?.total || 0}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active APIs</p>
                <p className="text-2xl font-bold text-green-600">{status?.active || 0}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive APIs</p>
                <p className="text-2xl font-bold text-red-600">{status?.inactive || 0}</p>
              </div>
              <div className="text-2xl">❌</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {status?.total ? Math.round((status.active / status.total) * 100) : 0}%
                </p>
              </div>
              <div className="text-2xl">💊</div>
            </div>
          </div>
        </div>

        {/* Gemini APIs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🤖 Gemini APIs
            </h3>
            <p className="text-gray-600">Google Gemini API endpoints for image analysis and content generation</p>
          </div>
          <div className="p-6 space-y-4">
            {status?.gemini?.length ? status.gemini.map((api) => (
              <div key={api.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(api.isActive, api.errorCount)}</span>
                  <div>
                    <div className="font-medium">{api.id}</div>
                    <div className="text-sm text-gray-500">
                      Errors: {api.errorCount} | Last Error: {api.lastError || 'None'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(api.isActive, api.errorCount)}`}>
                    {api.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => resetAPI(api.id)}
                    disabled={api.isActive && api.errorCount === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">No Gemini APIs configured</p>
            )}
          </div>
        </div>

        {/* Perplexity API */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🔍 Perplexity API
            </h3>
            <p className="text-gray-600">Perplexity AI for research and insights</p>
          </div>
          <div className="p-6 space-y-4">
            {status?.perplexity?.length ? status.perplexity.map((api) => (
              <div key={api.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(api.isActive, api.errorCount)}</span>
                  <div>
                    <div className="font-medium">{api.id}</div>
                    <div className="text-sm text-gray-500">
                      Errors: {api.errorCount} | Last Error: {api.lastError || 'None'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(api.isActive, api.errorCount)}`}>
                    {api.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => resetAPI(api.id)}
                    disabled={api.isActive && api.errorCount === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">No Perplexity APIs configured</p>
            )}
          </div>
        </div>

        {/* Configuration Guide */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🔧 Configuration Guide</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Environment Variables Required:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3</li>
              <li>PERPLEXITY_API_KEY</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> APIs will automatically rotate when quotas are reached. 
              Use the reset button to manually clear error states.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}