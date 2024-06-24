// src/sdk/ExchangeSDK.js
import BigNumber from "bignumber.js";
import Router from '../../scripts/contracts/abis/Router.sol/Router.json';
import { formatUnits, parseUnits } from "ethers";
import WNATIVE from '../../scripts/contracts/abis/TestContract/TWIOTX.sol/TWIOTX.json';
import { writeContract } from '@wagmi/core';
import { CONTRACT_ADDRESSES } from '../../scripts/constants/contractAddresses';
import { fetchPoolBalance, createPair, fetchQuoteAddLiquidity, fetchPoolExistence, approve } from '../../scripts/utils'
import { TOKENS } from '../../scripts/constants/tokens'

// import { config } from '../../scripts/config';
const chainId = 4689
const tokens = TOKENS[chainId]
class Liquidity {
    contractAddresses;
    routerAbi;
    wnativeAbi;

    constructor(config) {
        this.config = config
        this.contractAddresses = CONTRACT_ADDRESSES;
        this.routerAbi = Router.abi;
        this.wnativeAbi = WNATIVE.abi;
    }

    async add(
        accountAdddress,
        tokenInputA,
        tokenInputB,
        stable,
        amountInTokenA,
        slippage,
        amountInTokenB
    ) {
        try {
            const contractList = this.contractAddresses[chainId]
            const pool = await fetchPoolExistence(tokenInputA, tokenInputB, stable, this.config, accountAdddress)
            const tokenA = tokens.find(item => item.address.toLowerCase() === tokenInputA.toLowerCase())
            const tokenB = tokens.find(item => item.address.toLowerCase() === tokenInputB.toLowerCase())
            if (pool) {
                const value1 = formatUnits(pool.reserve0.toString(), Number(pool.token0_decimals))
                const value2 = formatUnits(pool.reserve1.toString(), Number(pool.token1_decimals))
                const value3 = new BigNumber(value1 || 0).div(new BigNumber(value2 || 1))
                const exchangeRate = value3.toFixed()
                console.log(exchangeRate, amountInTokenA, '===>amountInTokenA')
                const result = this.convertTokenAtoTokenB(amountInTokenA, exchangeRate, Number(tokenA.decimals), Number(tokenB.decimals))
                console.log(result, '===>result')
                amountInTokenB = result
            }
            if(!pool && !amountInTokenB){
                return 'The "amountInTokenB" parameter must be passed in the absence of a mobility pool.'
            }
            console.log(amountInTokenA, amountInTokenB, '===>amountInTokenA')
            const token0 = (tokenA?.address === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenA.address)
            const token1 = (tokenB?.address === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenB.address)
            if (tokenA?.address?.toLowerCase() !== contractList.IOTX.toLowerCase()) {
                const approvehash = await approve(token0, amountInTokenA, this.config);
            }
            if (tokenB?.address?.toLowerCase() !== contractList.IOTX.toLowerCase()) {
                const approvehash = await approve(token1, amountInTokenB, this.config);
            }
            const result = await fetchPoolBalance(accountAdddress, tokenInputA, tokenInputB, stable, this.config);
            if (result?.pairFor === '0x0000000000000000000000000000000000000000') {
                const AddtxHash = await createPair(token0, token1, stable, this.config);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log(accountAdddress, tokenInputA, tokenInputB, '===>tokenInputB')


            let addMethodName;
            let args;
            const quoteAdd = await fetchQuoteAddLiquidity(token0, token1, stable, amountInTokenA, amountInTokenB, this.config)
            const amountTokenAMin = this.calculateAmountOutMin(quoteAdd[0], slippage)
            const amountTokenBMin = this.calculateAmountOutMin(quoteAdd[1], slippage)
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix timestamp
            if (tokenInputA === contractList.IOTX || tokenInputB === contractList.IOTX) {
                addMethodName = 'addLiquidityETH'
                args = [
                    tokenInputA === contractList.IOTX ? tokenInputB : tokenInputA,
                    stable,
                    tokenInputA === contractList.IOTX ? amountInTokenB : amountInTokenA,
                    tokenInputA === contractList.IOTX ? amountTokenBMin : amountTokenAMin,
                    tokenInputA === contractList.IOTX ? amountTokenAMin : amountTokenBMin, accountAdddress, deadline]
            } else {
                addMethodName = 'addLiquidity'
                args = [tokenInputA, tokenInputB, stable, amountInTokenA, amountInTokenB, amountTokenAMin, amountTokenBMin, accountAdddress, deadline]
            }
            const value = (tokenInputA === contractList.IOTX) ? amountInTokenA : ((tokenInputB === contractList.IOTX) ? amountInTokenB : BigInt(0))
            const hash = await writeContract(this.config, {
                address: contractList.ROUTER,
                abi: this.routerAbi,
                functionName: addMethodName,
                args: args,
                value: value,
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
    convertTokenAtoTokenB(amountA, rate, precisionA, precisionB) {
        const amountABig = new BigNumber(amountA);
        const amountBIntermediate = amountABig.times(rate);
        const precisionAdjustment = new BigNumber(10).pow(precisionA - precisionB);
        const amountBBig = amountBIntermediate.div(precisionAdjustment);
        const amountBFinal = amountBBig.integerValue(BigNumber.ROUND_FLOOR);
        return amountBFinal.toString();
    }
}

export default Liquidity;