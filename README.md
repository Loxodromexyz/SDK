## Install
Install `loxodrome-sdk` with one of the following package management tools：
- Use npm:
```shell
$ npm install loxodrome-sdk
```
- Use yarn:
```shell
$ yarn add loxodrome-sdk
```
- Use pnpm:
```shell
$ pnpm add loxodrome-sdk
```

## Introductory class
Introduce the required classes in the project. For example, use the `Swap` class:
```javascript
import { Swap } from 'loxodrome-sdk';
```
## Initialization
Before using the `Liquidity` or `Swap` classes, you need to instantiate them and pass in a configuration object.This configuration object should contain all necessary configurations such as provider, network ID, etc. Currently only network ID 4689 is supported.

### Configuration example 
Currently using wagmi version 2.5.13 configuration. You need to use wagmi's `config` object in your local project, as shown below:

```javascript
import { createConfig, http } from '@wagmi/core'

export const config = createConfig({
  chains: [iotex],
  transports: {
    [iotex.id]: http()
  },
})

```

Please refer to [wagmi documentation](https://wagmi.sh/react/api/createConfig) for specific configuration. 

### Initialization Classes 

```javascript
import { Liquidity } from 'loxodrome-sdk'
const liquidity = new Liquidity(config);
```

## Liquidity Class
The `Liquidity` class is used to manage liquidity operations, providing functions for adding liquidity, calculating minimum output amounts, and converting token quantities. 

### Function
#### `add(accountAddress, tokenA, tokenB, stable, amountInTokenA, slippage, amountInTokenB)`
Add liquidity to the liquidity pool. 
##### Parameters 
This method is used to add mobility to the mobility pool. It requires the following parameters:
- `accountAddress`:String - The user's wallet address. 
- `tokenA`:String - The address of the first token. 
- `tokenB`:String - The address of the second token. 
- `stable`:Boolean - Boolean value indicating whether it is a stablecoin pair.
- `amountInTokenA`: String | bigint The amount invested in token A (the amount with precision, of type string or bigint). 
- `slippage`::number - Percentage of slippage allowed (pass 0-1 decimal point). 
- `amountInTokenB`: String | bigint - The amount invested in Token B (this value must be passed when the market does not exist for the current transaction to the liquidity pool. (When the market exists for the current pair of liquidity pools, this value does not need to be passed and will be calculated automatically).

##### Return value 
Returns a transaction hash or failure message. 
##### Typical example 

```javascript
liquidity.add(accountAddress, tokenA, tokenB, stable, amountInTokenA, slippage)
    .then(hash => console.log('Transaction Hash:', hash))
    .catch(error => console.error('Error adding liquidity:', error));
```

## Swap Class
The Swap class is a tool for performing token exchange operations that supports the exchange of different types of tokens on the blockchain. It utilizes smart contracts to interact with the blockchain in order to implement the token swap function.

### Function
#### `swap(address, tokenA, tokenB, amountIn, slippage, deadlineMinutes)`
Perform a token exchange. 
##### Parameters
- `address`: String - The user's wallet address. 
- `tokenA`: String - The address of the contract whose tokens are being exchanged. 
- `tokenB`: String - The contract address of the token obtained from the transaction. 
- `amountIn`: String | BigInt - The number of tokens being exchanged. 
- `slippage`: Number - Percentage of price slippage allowed (pass 0-1 decimal point). 
- `deadlineMinutes`: Number - Trading Deadline (in minutes). 

##### Return value
Returns a transaction hash or failure message. 
##### Typical example 

```javascript
swapInstance.swap(address, tokenA, tokenB, amountIn, slippage, deadlineMinutes)
  .then(hash => console.log("Transaction hash:", hash))
  .catch(error => console.error("Trading error:", error));
```

#### `fetchAmountOut(tokenA,tokenB,amountIn)`
Used to get an estimate of the number of tokens that will be received as a result of the transaction
##### Parameters
- `tokenA`: String - The address of the contract whose tokens are being exchanged. 
- `tokenB`: String - The contract address of the token obtained from the transaction. 
- `amountIn`: String | BigInt - The number of tokens being exchanged. 

##### Return value
Returns a amountOut and path or failure message. 

