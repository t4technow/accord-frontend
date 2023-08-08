import ReactDOM from "react-dom/client";

// Provider and store to give access to the components to states and actions in redux
import { Provider } from "react-redux";
import { Store } from "./redux/Store.ts";

import App from "./App.tsx";
import "./index.css";


ReactDOM.createRoot(document.getElementById("accord")!).render(
	<Provider store={Store}>
		<App />
	</Provider>
);
