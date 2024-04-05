import "./App.css";
import { logInDev } from "@utils/log-utils";

function App() {
  logInDev("Logging app..");

  return <div className="app">Hello from app</div>;
}

export default App;
