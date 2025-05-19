import React, { Component } from 'react';

class AbstractBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in AbstractBoundary:", error, errorInfo);
  }

  renderErrorMessage() {
    throw new Error("renderErrorMessage() must be implemented in subclass");
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorMessage(); 
    }
    return this.props.children;
  }
}

class ErrorBoundary extends AbstractBoundary {
  renderErrorMessage() {
    return (
      <div className="error h-screen w-screen flex items-center justify-center bg-black">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight lg:text-5xl text-white/65">
          Something went wrong.
        </h1>
      </div>
    );
  }
}

export default ErrorBoundary;
