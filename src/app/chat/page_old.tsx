'use client';

import { chains } from "@/lib/constants";
import { ChainId, EVM, createConfig, executeRoute, getQuote, getRoutes } from "@lifi/sdk";
import { useChat } from 'ai/react';
import { useEffect } from 'react';
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

export default function Chat() {

  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxSteps: 5,
      async onToolCall({ toolCall }) {
        // Handle LiFi tool calls
        switch (toolCall.toolName) {
          case 'getBalanceOfTokenByChain': {
            const { isStablecoin, tokenAddress, walletAddress, chainId } = toolCall.args;
            try {
              const selectedChain = chains.find((chain) => chain.id === Number(chainId));
              if (!selectedChain) {
                throw new Error(`Unsupported chain ID: ${chainId}`);
              }
              const client = createPublicClient({
                chain: selectedChain,
                transport: http(),
              });
              const balance = await client.readContract({
                address: tokenAddress as `0x${string}`,
                abi: [{ "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
                functionName: "balanceOf",
                args: [walletAddress as `0x${string}`]
              });

              const decimals = isStablecoin ? 6 : 18;
              return balance.toString();
            } catch (error) {
              console.error("Failed to get balance:", error);
              throw error;
            }
          }

          case 'getQuote': {
            try {
              const result = await getQuote(toolCall.args);
              return JSON.stringify(result);
            } catch (error) {
              console.error("Failed to get quote:", error);
              throw error;
            }
          }

          case 'executeRoute': {
            try {
              const result = await getRoutes(toolCall.args);
              if (!result.routes.length) {
                throw new Error("No routes found");
              }
              
              const route = result.routes[0];
              let routeId: string | undefined;

              const routePromise = executeRoute(route, {
                updateRouteHook(updatedRoute) {
                  console.log("Route update:", updatedRoute);
                  routeId = updatedRoute.id;
                },
              });

              // Wait for route execution to start
              await new Promise(resolve => setTimeout(resolve, 1000));

              return JSON.stringify({ 
                message: "Route execution started", 
                routeId,
                route: result.routes[0] 
              });
            } catch (error) {
              console.error("Failed to execute route:", error);
              throw error;
            }
          }
        }
      },
    });

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="font-bold text-zinc-100">
              {message.role === 'assistant' ? 'AI' : 'You'}:
            </div>
            <div className="text-zinc-300 whitespace-pre-wrap">
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <span key={i}>{part.text}</span>;
                  
                  case 'tool-invocation': {
                    const toolInvocation = part.toolInvocation;
                    switch (toolInvocation.state) {
                      case 'call':
                        return (
                          <div key={i} className="text-zinc-400 my-2">
                            <div>Executing {toolInvocation.toolName}...</div>
                            <div className="text-sm opacity-75">
                              Parameters: {JSON.stringify(toolInvocation.args, null, 2)}
                            </div>
                          </div>
                        );
                      case 'result':
                        let displayResult = toolInvocation.result;
                        try {
                          // Try to parse and format JSON results
                          const parsed = JSON.parse(toolInvocation.result);
                          displayResult = JSON.stringify(parsed, null, 2);
                        } catch {
                          // If not JSON, use as is
                          displayResult = toolInvocation.result;
                        }
                        return (
                          <div key={i} className="text-zinc-400 my-2">
                            <div>{toolInvocation.toolName} result:</div>
                            <pre className="bg-zinc-900 p-2 rounded mt-1 overflow-x-auto">
                              {displayResult}
                            </pre>
                          </div>
                        );
                      default:
                        return null;
                    }
                  }
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="w-full p-2 text-zinc-100 bg-zinc-900 rounded border border-zinc-700 focus:outline-none focus:border-zinc-500"
        />
      </form>
    </div>
  );
}
