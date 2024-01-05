//import { Route, Router } from "react-router-dom";
//import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Login from "./components/Login";
import { useState } from "react";

function App() {
  const [token, setToken] = useState();
  const handleLogin = (token) => {
    setToken(token);
  };
  return (
    <div className="App">
      {token ? (
        <div>
          <Home />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;