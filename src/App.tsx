import { useEffect } from "react";
import { AppRouter } from "./app/AppRouter";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return <AppRouter />;
}

export default App;
