import React, {useContext, useState, useEffect} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";

const App = observer(() => {
    const {user} = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        check().then( data =>{
            if(data) {
                console.log(data);
                user.setUser(data);
                user.setIsAuth(true);
                console.log("mavci")
            }
        }).finally(() => setLoading(false))
    }, []);
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <NavBar/>
                <AppRouter/>
                <Footer/>
            </div>
        </BrowserRouter>
    );
});

export default App;