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
import presale from "./contracts/PreSaleV2.json"
import swap from "./contracts/XEQSwaps.json"
import softStakingv2 from "./contracts/SoftStakingv2.json"
import IERC20 from "./contracts/uniswap.json"
import staking from "./contracts/StakingPools.json"

const options = {
    contracts: [Master, wXEQ, softStaking, presale, swap, softStakingv2, IERC20, staking],
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
ReactDOM.render(<App drizzle={drizzle} style={{"backgroundColor":"#252525"}} />, document.getElementById('root'));
