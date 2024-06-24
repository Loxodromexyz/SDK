export declare class Swap {
    constructor(config: any);
    swap(address:string,tokenA:string,tokenB:string,amountIn:string | bigint,slippage:number,deadlineMinutes:number): any;
    fetchAmountOut(tokenA:string,tokenB:string,amountIn:string | bigint):any
}

// 导出 Liquidity 类
export declare class Liquidity {
    constructor(config: any);
    add(accountAdddress:string,tokenInputA:string,tokenInputB:sting,stable:boolean,amountInTokenA:string | bigint,slippage:number,amountInTokenB?:string | bigint): string;
}