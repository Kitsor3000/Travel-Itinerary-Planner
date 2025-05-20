import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
   
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
   
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
    
      return (
        <div className="error h-screen w-screen flex items-center justify-center bg-black">
            <h1 className='text-3xl sm:text-4xl font-extrabold text-center tracking-tight lg:text-5xl text-white/65'>Somthing went wrong</h1>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
