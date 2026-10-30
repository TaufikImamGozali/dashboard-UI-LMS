import React from 'react';
import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return <EmptyState title="Page not found" description="The page you are looking for does not exist or may have moved." actionLabel="Back to Dashboard" onAction={() => navigate('/dashboard')} icon={<Compass className="h-7 w-7" />} headingLevel="h1" className="min-h-empty" />;
};
