import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "@drizzle/store";
import Master from "./contracts/Master.json";
import wXEQ from "./contracts/wXEQ.json"
import softStaking from "./contracts/SoftStaking.json"
import presale from "./contracts/PreSale.json"
import SmartContractModal from "./components/SmartContractModal";

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
    contracts: [Master, wXEQ, softStaking, presale],
    web3: {
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:9545",
        },
    },
};

// setup the drizzle store and drizzle
const drizzle = new Drizzle(options);
// <SmartContractModal/>
ReactDOM.render(<App drizzle={drizzle} style={{"background-color":"#252525"}} />, document.getElementById('root'));