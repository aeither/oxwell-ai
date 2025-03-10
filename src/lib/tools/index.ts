
import { carvTools } from "./carv-tools";

//   convertTokenAmountToWei: tool({
//     description: "Convert Token decimal amount to Wei",
//     parameters: z.object({
//       amount: z.string().describe("Amount of Token to convert")
//     }),
//     execute: async ({ amount }) => {
//       return parseUnits(amount, 18).toString();
//     }
//   }),

//   convertStablecoinAmountToDecimals: tool({
//     description: "Convert stablecoin amount to its smallest unit. Stablecoin examples: USDC/DAI/USDT",
//     parameters: z.object({
//       amount: z.string().describe("Amount of stablecoin to convert")
//     }),
//     execute: async ({ amount }) => {
//       return parseUnits(amount, 6).toString();
//     }
//   }),

//   convertTokenSymbolToTokenAddress: tool({
//     description: "Convert token symbol to token address on a specific chain",
//     parameters: z.object({
//       chain: z.string().describe("Chain ID (e.g., '42161' for Arbitrum)"),
//       symbol: z.string().describe("Token symbol (e.g., 'USDC')")
//     }),
//     execute: async ({ chain, symbol }) => {
//       try {
//         const response = await fetch(
//           `https://li.quest/v1/token?chain=${chain}&token=${symbol}`,
//           {
//             headers: {
//               accept: 'application/json'
//             }
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch token info: ${response.statusText}`);
//         }

//         const data = await response.json();
//         return data.address.toString();
//       } catch (error) {
//         return "UNDEFINED Token"
//       }
//     }
//   }),
// };

// Combine all tools
export const tools = {
  ...carvTools
};
