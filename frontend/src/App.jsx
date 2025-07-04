import { useState } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(null);

  return token ? (
    <Dashboard token={token} />
  ) : (
    <LoginPage onLogin={setToken} />
  );
}

export default App;
