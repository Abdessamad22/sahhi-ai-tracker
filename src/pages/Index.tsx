
import { Navigate } from "react-router-dom";

// This file is just redirecting to our home page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
