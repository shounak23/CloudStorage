import { Provider, useSelector } from "react-redux";
import "./App.css";
import { store } from "./store/store";
import { useEffect } from "react";
import AppBootstrap from "./components/AppBootstrap";

function App() {
  // debugger;

  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  );
}

export default App;
