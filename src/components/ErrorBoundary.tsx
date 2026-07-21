import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || String(error) };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error atrapado por ErrorBoundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "sans-serif",
          background: "#f8fafc",
          textAlign: "center",
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            Algo salió mal cargando esto
          </h1>
          <p style={{ color: "#475569", maxWidth: 480, marginBottom: 4 }}>
            Probablemente esta estrategia se guardó con un formato distinto al actual.
          </p>
          <p style={{ color: "#94a3b8", fontSize: 12, maxWidth: 480, marginBottom: 20, fontFamily: "monospace" }}>
            {this.state.errorMessage}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
