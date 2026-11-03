import { Provider, useSelector } from "react-redux";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { store } from "./store/store";
import { useEffect } from "react";

function App() {
  // debugger;
  const { theme } = useSelector((state) => state.themes);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
