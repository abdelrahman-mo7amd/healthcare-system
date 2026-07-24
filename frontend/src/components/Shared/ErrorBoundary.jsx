import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="card" style={{ margin: 24 }}>
          <h3 style={{ marginTop: 0 }}>Something went wrong</h3>
          <p style={{ color: "var(--color-ink-soft)" }}>
            This part of the system hit an unexpected error. Try reloading the page.
          </p>
          <button className="btn btn-outline" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
