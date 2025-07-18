import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import "antd/dist/reset.css"; // Antd 5.x 이상일 때

function App() {
  return (
    <Router>
      <Header />
      <div style={{ minHeight: "80vh" }}>
        <AppRoutes />
      </div>
      <Footer />
    </Router>
  );
}

export default App;