// src/sdk/ExchangeSDK.js
import BigNumber from "bignumber.js";
import Router from '../../scripts/contracts/abis/Router.sol/Router.json';
import WNATIVE from '../../scripts/contracts/abis/TestContract/TWIOTX.sol/TWIOTX.json';
import { writeContract } from '@wagmi/core';
import { CONTRACT_ADDRESSES } from '../../scripts/constants/contractAddresses';
import { fetchAmount, formatDecimals, approve } from '../../scripts/utils'

// import { config } from '../../scripts/config';
const chainId = 4689
class Swap {
    contractAddresses;
    routerAbi;
    wnativeAbi;

    constructor(config) {
        this.config = config
        this.contractAddresses = CONTRACT_ADDRESSES;
        this.routerAbi = Router.abi;
        this.wnativeAbi = WNATIVE.abi;
    }

    async swap(
        address,
        tokenA,
        tokenB,
        amountIn,
        slippage,
        deadlineMinutes
    ) {
        if (tokenA?.toLowerCase() !== this.contractAddresses[chainId].IOTX.toLowerCase()) {
            const approvehash = await approve(tokenA, amountIn,this.config);
            if (!approvehash) return 'Failed to approve token A';
        }
        const deadline = Math.floor(Date.now() / 1000) + 60 * deadlineMinutes;
        const value = amountIn;
        let swapMethodName;
        let args;
        let contractAddress;
        let abi;
        let path;
        let amountOut;
        const data = await fetchAmount(tokenA, tokenB, value, this.config)
        if (data.type === 'worrap') {
            amountOut = amountIn
            path = []
        } else {
            amountOut = data.swapData.returnValue.output.finalValue
            path = data.swapData.returnValue.output.routes
        }
        const amountOutMin = this.calculateAmountOutMin(amountOut, slippage);
        if (tokenA === this.contractAddresses[chainId].IOTX) {
            if (tokenB === this.contractAddresses[chainId].WRAPPED_IOTX) {
                swapMethodName = 'deposit';
                args = [];
                contractAddress = this.contractAddresses[chainId].WRAPPED_IOTX;
                abi = this.wnativeAbi;
            } else {
                swapMethodName = 'swapExactETHForTokens';
                args = [amountOutMin, path, address, deadline];
                contractAddress = this.contractAddresses[chainId].ROUTER;
                abi = this.routerAbi;
            }
        } else if (tokenB === this.contractAddresses[chainId].IOTX) {
            if (tokenA === this.contractAddresses[chainId].WRAPPED_IOTX) {
                swapMethodName = 'withdraw';
                args = [value];
                contractAddress = this.contractAddresses[chainId].WRAPPED_IOTX;
                abi = this.wnativeAbi;
            } else {
                swapMethodName = 'swapExactTokensForETH';
                args = [value, amountOutMin, path, address, deadline];
                contractAddress = this.contractAddresses[chainId].ROUTER;
                abi = this.routerAbi;
            }
        } else {
            swapMethodName = 'swapExactTokensForTokens';
            args = [value, amountOutMin, path, address, deadline];
            contractAddress = this.contractAddresses[chainId].ROUTER;
            abi = this.routerAbi;
        }
        const ETHValue = (tokenA === this.contractAddresses[chainId].IOTX) ? BigInt(value) : BigInt(0)
        try {
            const hash = await writeContract(this.config, {
                address: contractAddress,
                abi: abi,
                functionName: swapMethodName,
                args: args,
                value: ETHValue
            })
            return hash
        } catch (error) {
            return error
        }

    }

    calculateAmountOutMin(amountOut, slippage) {
        const amountOutBigNumber = new BigNumber(amountOut);
        const reduction = amountOutBigNumber.times(slippage / 100);
        return amountOutBigNumber.minus(reduction).toFixed(0);
    }
}

export default Swap;