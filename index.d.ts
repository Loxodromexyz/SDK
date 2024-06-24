export declare class Swap {
    swap(address:string,tokenA:string,tokenB:string,amountIn:string | bigint,slippage:number,deadlineMinutes:number): any;
}

// 导出 Liquidity 类
export declare class Liquidity {
    add(accountAdddress:string,tokenInputA:string,tokenInputB:sting,stable:boolean,amountInTokenA:string | bigint,slippage:number,amountInTokenB?:string | bigint): string;
}