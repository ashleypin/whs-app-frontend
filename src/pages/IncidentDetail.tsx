import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { incidentService } from '../services/api';
import type { Incident } from '../types';

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) {
        setError('no incident ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // service call
        const data = await incidentService.getIncident(id);
        setIncident(data);
      } catch (err) {
        console.error('error fetching incident:', err);
        setError('failed to load incident details. please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'High': return 'bg-danger-500 text-white';
      case 'Medium': return 'bg-warning-500 text-white';
      case 'Low': return 'bg-success-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'In Progress': return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Resolved': return 'bg-gray-50 text-gray-600 border border-gray-200';
      case 'Closed': return 'bg-gray-50 text-gray-500 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // helper func to extract user display info
  const getUserDisplay = (reportedBy: any) => {
    if (typeof reportedBy === 'string') {
      return { name: reportedBy }; // Just an ID
    }
    if (reportedBy && typeof reportedBy === 'object') {
      return {
        name: reportedBy.name || 'Unknown User',
      };
    }
    return { name: 'Unknown User' };
  };

  // helper func to extract workplace display info
  const getWorkplaceDisplay = (workplaceId: any) => {
    if (typeof workplaceId === 'string') {
      return { name: workplaceId, location: null };
    }
    if (workplaceId && typeof workplaceId === 'object') {
      return {
        name: workplaceId.name || 'Unknown Workplace',
        location: workplaceId.location || null
      };
    }
    return { name: 'Unknown Workplace', location: null };
  };

  // loading state
  if (loading) {
    return (
      <Layout title="Incident Details" showBackButton onBack={() => navigate('/dashboard')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading incident details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // error state
  if (error || !incident) {
    return (
      <Layout title="Incident Details" showBackButton onBack={() => navigate('/dashboard')}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error || 'incident not found'}</div>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-2"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/incidents')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back To Incidents
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // get display info
  const userInfo = getUserDisplay(incident.reportedBy);
  const workplaceInfo = getWorkplaceDisplay(incident.workplaceId);

  return (
    <Layout 
      title="Incident Details" 
      showBackButton 
      onBack={() => navigate('/incidents')}
    >
      {/* incident header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-800 flex-1 pr-4">
            {incident.title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(incident.riskLevel)}`}>
            {incident.riskLevel} Risk
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(incident.status)}`}>
            {incident.status}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(incident.createdAt)}
          </span>
        </div>
      </div>

      {/* incident details */}
      <div className="space-y-6">
        {/* description */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {incident.description}
          </p>
        </div>

        {/* incident info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Incident Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Incident ID
              </label>
              <p className="text-sm text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded">
                {incident._id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Reported By
              </label>
              <div className="text-sm text-gray-800">
                <p className="font-medium">{userInfo.name}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Workplace
              </label>
              <div className="text-sm text-gray-800">
                <p className="font-medium">{workplaceInfo.name}</p>
                <p className="font-medium">{workplaceInfo.location}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Created
              </label>
              <p className="text-sm text-gray-800">
                {formatDate(incident.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* photo section - WIP */}

        {/* actions section - placeholder  */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => alert('WIP')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update Status
            </button>
            
            <button
              onClick={() => alert('WIP')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Progress Note
            </button>
            
            <button
              onClick={() => navigate(`/incidents/${incident._id}/edit`)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              disabled
            >
              Edit Incident
            </button>
            
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this incident?')) {
                  alert('WIP');
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Incident
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}