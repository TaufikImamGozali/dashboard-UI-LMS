import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Coursue render error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg p-6">
        <div className="w-full max-w-md rounded-card border border-outline bg-surface p-8 text-center shadow-container">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><AlertTriangle className="h-7 w-7" /></span>
          <h1 className="mt-5 text-2xl font-extrabold text-content-primary">Something went wrong</h1>
          <p className="mt-2 text-sm leading-relaxed text-content-secondary">We could not display this page. Your saved learning data is still safe.</p>
          <button type="button" onClick={() => this.setState({ hasError: false })} className="mt-6 inline-flex min-h-touch items-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"><RotateCcw className="h-4 w-4" /> Try again</button>
        </div>
      </main>
    );
  }
}
