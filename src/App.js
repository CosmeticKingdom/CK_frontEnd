import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css"; // Antd 5.x 이상일 때

function App() {
  return (
    <ConfigProvider>
      <Router>
        <AuthProvider>
          <Header />
          <div style={{ minHeight: "80vh" }}>
            <AppRoutes />
          </div>
          <Footer />
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;