import { ChainId } from "@lifi/sdk";
import { tool } from 'ai';
import { createPublicClient, formatUnits, http, parseEther, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from 'zod';
import { chainInfo } from './chainInfo';
import { chains } from './constants';

// Basic Tools (Server-side)
export const basicTools = {
  getMyWalletAddress: tool({
    description: "get the wallet address of the owner",
    parameters: z.object({}),
    execute: async () => {
      const walletClient = privateKeyToAccount(
        `${process.env.PRIVATE_KEY}` as `0x${string}`
      );
      return String(walletClient.address);
    }
  }),

  convertEtherToWei: tool({
    description: "Convert Ether to Wei",
    parameters: z.object({
      amount: z.string().describe("Amount of Ether to convert")
    }),
    execute: async ({ amount }) => {
      return parseEther(amount).toString();
    }
  }),

  convertStablecoinToDecimals: tool({
    description: "Convert stablecoin amount to its smallest unit",
    parameters: z.object({
      amount: z.string().describe("Amount of stablecoin to convert")
    }),
    execute: async ({ amount }) => {
      return parseUnits(amount, 6).toString();
    }
  })
};

// LiFi Tools (Client-side)
export const lifiTools = {
  getBalanceOfTokenByChain: tool({
    description: "Get the balance of a token for a specific wallet address",
    parameters: z.object({
      isStablecoin: z.boolean().describe("True if the token is a stablecoin such as USDC, USDT, or DAI"),
      tokenAddress: z.string().describe("The token address to get the balance for"),
      walletAddress: z.string().describe("The wallet address to get the balance for"),
      chainId: z.string().describe("The chain id to get the balance for")
    })
  }),

  getQuote: tool({
    description: "Get a quote for a LiFi swap",
    parameters: z.object({
      fromAddress: z.string().describe("The address from which the tokens are being transferred"),
      fromChain: z.nativeEnum(ChainId).describe("The source chain ID"),
      toChain: z.nativeEnum(ChainId).describe("The destination chain ID"),
      fromToken: z.string().describe("The address of the token to swap from"),
      toToken: z.string().describe("The address of the token to swap to"),
      fromAmount: z.string().describe("The amount of tokens to swap")
    })
  }),

  executeRoute: tool({
    description: "Execute a LiFi route",
    parameters: z.object({
      fromAddress: z.string().describe("The address from which the tokens are being transferred"),
      fromChainId: z.nativeEnum(ChainId).describe("The source chain ID"),
      toChainId: z.nativeEnum(ChainId).describe("The destination chain ID"),
      fromTokenAddress: z.string().describe("The address of the token to swap from"),
      toTokenAddress: z.string().describe("The address of the token to swap to"),
      fromAmount: z.string().describe("The amount of tokens to swap")
    })
  })
};

// Combine all tools
export const tools = {
  ...basicTools,
  ...lifiTools
};
