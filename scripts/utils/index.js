import { CONTRACT_ADDRESSES } from '../constants/contractAddresses';
import { TOKENS } from '../constants/tokens'
import { readContract } from '@wagmi/core';
import Router from '../contracts/abis/Router.sol/Router.json'
import PairFactory from '../contracts/abis/factories/PairFactory.sol/PairFactory.json'
import PairAPI from '../contracts/abis/APIHelper/PairAPIV2.sol/PairAPI.json'
import BigNumber from 'bignumber.js';
import pairContractABI from '../contracts/abis/Pair.sol/Pair.json'
import { zeroAddress } from "viem";
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import ERC20 from '../contracts/abis/TestContract/ERC20Token.sol/ERC20Token.json'
import LoxoLib from '../contracts/abis/LoxoLibrary.sol/LoxoLibrary.json'

const chainId = 4689
export const fetchAmount = async (token1, token2, amountIn, config) => {
    const contractList = CONTRACT_ADDRESSES[chainId]
    const tokens = TOKENS[chainId]
    const tokenA = tokens.find(item => item.address.toLowerCase() === token1.toLowerCase())
    const tokenB = tokens.find(item => item.address.toLowerCase() === token2.toLowerCase())
    try {
        if (tokenA?.address?.toLowerCase() === contractList?.IOTX?.toLowerCase() && tokenB?.address?.toLowerCase() === contractList?.WRAPPED_IOTX?.toLowerCase() ||
            tokenB?.address?.toLowerCase() === contractList?.IOTX?.toLowerCase() && tokenA?.address?.toLowerCase() === contractList?.WRAPPED_IOTX?.toLowerCase()) {
            return {
                type: 'worrap',
                swapData: null
            }
        } else {
            const swapData = await findBestPath2(amountIn, tokenA, tokenB, contractList, tokens, config)
            return {
                type: 'swap',
                swapData
            }
        }
    } catch (error) {
        return {
            type: 'worrap',
            swapData: null
        }
    }
}
async function findBestPath2(
    amountIn,
    tokenA,
    tokenB,
    contractList,
    tokens,
    config
) {
    // console.log(tokenA, tokenB, amountIn, '===>amountIN')
    if (!tokenA || !tokenB || !amountIn || !tokenA.address || !tokenB.address || amountIn === '0') {
        return null
    }
    let addy0 = tokenA.address
    let addy1 = tokenB.address
    if (tokenA?.address?.toLowerCase() === contractList?.IOTX?.toLowerCase()) {
        addy0 = contractList.WRAPPED_IOTX
    }
    if (tokenB?.address?.toLowerCase() === contractList?.IOTX?.toLowerCase()) {
        addy1 = contractList.WRAPPED_IOTX
    }
    // const routeAssets = tokens.map(item=>{
    //     if(item.symbol === 'WIOTX' || item.symbol === 'tWIOTX'){
    //         return item
    //     }
    // })
    const record = tokens.find((item) => item.symbol === 'WIOTX' || item.symbol === 'TWIOTX' || item.symbol === 'tWIOTX')
    const defaultToken = [{
        "name": "wrapped IOTX Token",
        "symbol": "WIOTX",
        "decimals": 18,
        "address": "0xA00744882684C3e4747faEFD68D283eA44099D03",
        "logoURI": "/static/img/icon/tokens/IOTEX.svg"
    }]
    const routeAssets = record ? [record] : defaultToken
    const includesRouteAddress = routeAssets.filter((asset) => {
        return (asset.address.toLowerCase() == addy0.toLowerCase() || asset.address.toLowerCase() == addy1.toLowerCase())
    })
    let amountOuts = []
    if (includesRouteAddress.length === 0) {
        amountOuts = routeAssets.map((routeAsset) => {
            return [
                {
                    routes: [{
                        from: addy0,
                        to: routeAsset.address,
                        stable: true
                    }, {
                        from: routeAsset.address,
                        to: addy1,
                        stable: true
                    }],
                    routeAsset: routeAsset
                },
                {
                    routes: [{
                        from: addy0,
                        to: routeAsset.address,
                        stable: false
                    }, {
                        from: routeAsset.address,
                        to: addy1,
                        stable: false
                    }],
                    routeAsset: routeAsset
                },
                {
                    routes: [{
                        from: addy0,
                        to: routeAsset.address,
                        stable: true
                    }, {
                        from: routeAsset.address,
                        to: addy1,
                        stable: false
                    }],
                    routeAsset: routeAsset
                },
                {
                    routes: [{
                        from: addy0,
                        to: routeAsset.address,
                        stable: false
                    }, {
                        from: routeAsset.address,
                        to: addy1,
                        stable: true
                    }],
                    routeAsset: routeAsset
                }
            ]
        }).flat()
    }
    amountOuts.push({
        routes: [{
            from: addy0,
            to: addy1,
            stable: true
        }],
        routeAsset: null
    })

    amountOuts.push({
        routes: [{
            from: addy0,
            to: addy1,
            stable: false
        }],
        routeAsset: null
    })

    const receiveAmounts = await Promise.all(amountOuts.map(async (route) => {
        try {
            const amount = await getAmountsOut(amountIn, route.routes, contractList.ROUTER, config);
            return amount;
        } catch (error) {
            console.log(error)
            return [BigInt(0), BigInt(0), BigInt(0)]
        }
    }));
    for (let i = 0; i < receiveAmounts.length; i++) {
        amountOuts[i].receiveAmounts = receiveAmounts[i]
        amountOuts[i].finalValue = new BigNumber(receiveAmounts[i][receiveAmounts[i].length - 1]).div(10 ** tokenB.decimals).toFixed(tokenB.decimals)
    }
    const bestAmountOut = amountOuts.filter((ret) => {
        return ret != null
    }).reduce((best, current) => {
        if (!best) {
            return current
        }
        return (new BigNumber(best.finalValue).gt(current.finalValue) ? best : current)
    }, 0)
    if (!bestAmountOut) {
        return null
    }
    let totalRatio = 1;  // Initialize totalRatio if not done elsewhere in your code

    for (let i = 0; i < bestAmountOut.routes.length; i++) {
        const amountIn = bestAmountOut.receiveAmounts[i];

        // Check if it's the last element, if so, break out of loop
        if (i === bestAmountOut.receiveAmounts.length - 1) {
            break;
        }

        const amountOut = bestAmountOut.receiveAmounts[i + 1];
        let res;
        res = await getTradeDiff(
            amountIn,
            bestAmountOut.routes[i].from,
            bestAmountOut.routes[i].to,
            bestAmountOut.routes[i].stable,
            contractList.ROUTER,
            contractList.LOXlibrary,
            config
        );

        if (res && res[0] && res[1]) {
            const ratio = (new BigNumber(res[1]).minus(new BigNumber(res[0]))).div((new BigNumber(res[0])));
            totalRatio = parseFloat(ratio.times(100).toFixed(15));
        } else {
            console.error('Unexpected result from getTradeDiff:', res);
        }
    }


    const returnValue = {
        inputs: {
            fromAmount: amountIn,
            fromAsset: tokenA,
            toAsset: tokenB
        },
        output: bestAmountOut,
        priceImpact: totalRatio.toFixed(2)
    }
    return {
        returnValue
    };
}
async function getAmountsOut(amountIn, path, routerContract, config) {

    if (routerContract || amountIn || path) {
        try {
            const data = await readContract(config, {
                address: routerContract,
                abi: Router.abi,
                functionName: 'getAmountsOut',
                args: [amountIn, path]
            });
            if (data) {
                return data;
            } else {
                console.error('Unable to fetch output amounts');
                return [BigInt(0), BigInt(0), BigInt(0)]
            }
        } catch (error) {
            console.error('Error in getAmountsOut:', error);
            throw error;
        }
    } else {
        console.log("error ")
        return null

    }
}
async function getTradeDiff(amountIn, tokenIn, tokenOut, stable, routerAdd, LOXOLibContract, config) {
    let pairData = '0x0000000000000000000000000000000000000000'
    try {
        const data = await readContract(config, {
            address: routerAdd,
            abi: Router.abi,
            functionName: 'pairFor',
            args: [tokenIn, tokenOut, stable],
        });
        if (data) {
            pairData = data
        }
        if (pairData !== '0x0000000000000000000000000000000000000000' &&
            LOXOLibContract &&
            amountIn) {
            try {
                const tradeData = await readContract(config, {
                    address: LOXOLibContract,
                    abi: LoxoLib.abi,
                    functionName: 'getTradeDiff',
                    args: [amountIn, tokenIn, tokenOut, stable],
                });
                return tradeData || [];

            } catch (error) {
                console.log(error)
                return [BigInt(100), BigInt(100)]
            }
        }
    } catch (error) {
        console.error('Error encountered:', error);
        throw error;
    }

    console.log("Error in retrieving trade data");
    return null;
}
export const approve = async (tokenAddress, amount, config) => {
    const contractList = CONTRACT_ADDRESSES[chainId]
    // const feeData = await estimateFeesPerGas(config)
    const spender = contractList.ROUTER
    const hash = await writeContract(config, {
        address: tokenAddress,
        abi: ERC20.abi,
        functionName: 'approve',
        args: [spender, amount],
        // maxFeePerGas: feeData.maxFeePerGas as bigint,
        // maxPriorityFeePerGas: feeData.lastBaseFeePerGas as bigint,
    })
    // debugger
    const data = await waitForTransactionReceipt(config, {
        hash: hash
    })
    return data;
}
export const fetchPoolBalance = async (AcountAddress, tokenA, tokenB, stable, config) => {
    console.log('123dsssfd')
    try {
        const pairFor = await fetchPairAddress(tokenA, tokenB, stable, config)
        const data = await readContract(config, {
            address: pairFor,
            abi: pairContractABI.abi,
            functionName: 'balanceOf',
            args: [AcountAddress],
        });
        return { data, pairFor };
    } catch (error) {
        console.error('Error pool and balance:', error);
        return { data: 0n, pairFor: '0x0000000000000000000000000000000000000000' };
    }
}
const fetchPairAddress = async (tokenA, tokenB, stable, config) => {
    console.log(tokenA,tokenB,stable,'===>stable')
    try {
        const contractList = CONTRACT_ADDRESSES[chainId]
        if (contractList.ROUTER && tokenA, tokenB) {
            const data = await readContract(config, {
                address: contractList.ROUTER,
                abi: Router.abi,
                functionName: 'pairFor',
                args: [tokenA === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenA, tokenB === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenB, stable],
            });

            if (data && data !== '0x0000000000000000000000000000000000000000') {
                return data
            } else {
                return '0x0000000000000000000000000000000000000000'
            }
        } else {
            console.log('pair address')
        }
    } catch (error) {
        console.error('Error fetching liquidity pool existence:', error);
    }
}
export const createPair = async (tokenA, tokenB, stable, config) => {
    const contractList = CONTRACT_ADDRESSES[chainId]
    // const feeData = await estimateFeesPerGas(config)
    const hash = await writeContract(config, {
        address: contractList.PAIR_FACTORY,
        abi: PairFactory.abi,
        functionName: 'createPair',
        args: [tokenA, tokenB, stable],
    })
    return hash
}
export const fetchQuoteAddLiquidity = async (tokenA, tokenB, stable, amountA, amountB, config) => {
    try {
        const contractList = CONTRACT_ADDRESSES[chainId]
        const data = await readContract(config, {
            address: contractList.ROUTER,
            abi: Router.abi,
            functionName: 'quoteAddLiquidity',
            args: [tokenA === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenA, tokenB === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenB, stable, amountA, amountB],
        });
        return data

    } catch (error) {
        console.error('Error fetching quote Add liquidity :', error);
    }
}
const fetchPoolAddress = async (tokenA, tokenB, stable, config) => {
    try {
        const contractList = CONTRACT_ADDRESSES[chainId]
        const data = await readContract(config, {
            address: contractList.PAIR_FACTORY,
            abi: PairFactory.abi,
            functionName: 'getPair',
            args: [tokenA === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenA, tokenB === contractList.IOTX ? contractList.WRAPPED_IOTX : tokenB, stable],
        });
        console.log(data, '===>datassd')
        return data
    } catch (error) {
        console.log(error, '===>error')
        return '0x0000000000000000000000000000000000000000'
    }
}
export const fetchPoolExistence = async (tokenA, tokenB, IsStable, config, address) => {
    console.log(tokenA, tokenB, IsStable, '===>123ss')
    try {
        const poolAddress = await fetchPoolAddress(tokenA, tokenB, IsStable, config)
        if (poolAddress === zeroAddress) return
        console.log(poolAddress, '===>poolAddress')
        const data = await getPair(poolAddress, address, config)
        return data
    } catch (error) {
        return null
    }
}
const getPair = async (pairAddress, account, config) => {
    try {
        const contractList = CONTRACT_ADDRESSES[chainId]
        if (contractList.ROUTER) {
            const data = await readContract(config, {
                address: contractList.pairAPI,
                abi: PairAPI.abi,
                functionName: 'getPair',
                args: [pairAddress, account],
            });
            console.log(data, '===>asddf2')
            return data

        } else {
            console.log('pair error')
        }
    } catch (error) {
        console.error('Error fetching liquidity pool existence:', error);
    }
}