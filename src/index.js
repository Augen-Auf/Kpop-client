import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import './style/main.css';
import App from './App';
import UserStore from "./store/UserStore";


export const Context = createContext(null);

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
    }}>
        <App />
    </Context.Provider>,
    document.getElementById('root')
);

