import { useAuth } from "../contexts/AuthContext";

export const Dashboard = () => {
  const {
    state: { user },
    logout,
  } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
