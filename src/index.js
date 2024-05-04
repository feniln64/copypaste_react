import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/ibm-plex-sans";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = createTheme({
    typography: {
        fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
    },
});
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </PersistGate>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
