import { useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return null; // ou um loading simples depois
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
