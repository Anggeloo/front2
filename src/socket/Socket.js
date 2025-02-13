import { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import { urlSocket } from "../config/Urls";

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(urlSocket)
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => console.log("WebSocket on"))
            .catch(err => console.error("Error in WebSocket:", err));

        newConnection.on("WelcomeMessage", (message) => {
            const user = JSON.parse(localStorage.getItem("user"));
            if(user){
                toast.info(`${message}`, {
                    position: "bottom-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log(message);
            }
        });

        newConnection.on("UserLoggedIn", (message) => {
            const user = JSON.parse(localStorage.getItem("user"));
            if(user){
                toast.info(`${message}`, {
                    position: "bottom-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log(message);           
            }
        });

        newConnection.on("Logout", (codice) => {
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user, codice)
            if(user != null && user.userCode == codice){
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        });

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    return (
        <SignalRContext.Provider value={{ connection }}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => {
    return useContext(SignalRContext);
};
