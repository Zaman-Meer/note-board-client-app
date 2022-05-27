import React from "react";
import "./App.css";
import Board from "./containers/Board";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Board />
      </AuthProvider>
    </div>
  );
}

export default App;
