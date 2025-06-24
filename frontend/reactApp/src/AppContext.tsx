import React, { createContext, useContext, useState, useEffect } from "react";

type AppState = {
    room: string;
    temperature: number;
    humidity: number;
    lastUpdated: string;
};

const defaultState: AppState = {
    room: "",
    temperature: 0,
    humidity: 0,
    lastUpdated: "",
};

const AppContext = createContext<{
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
}>({
    state: defaultState,
    setState: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(() => {
        const stored = localStorage.getItem("appState");
        return stored ? JSON.parse(stored) : defaultState;
    });

    useEffect(() => {
        localStorage.setItem("appState", JSON.stringify(state));
    }, [state]);

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppState = () => useContext(AppContext);