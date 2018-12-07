import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./js/store/index";
import './css/index.css';
import App from './js/components/App';
import { addMusic } from "./js/actions/index";
import * as serviceWorker from './js/serviceWorker';

// This is for debugging, can be invoked from the web console.
window.store = store;
window.addMusic = addMusic;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
