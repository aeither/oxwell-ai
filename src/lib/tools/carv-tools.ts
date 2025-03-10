import { tool } from 'ai';
import { z } from 'zod';
import axios from 'axios';
import 'dotenv/config';

const CARV_API_BASE_URL = 'https://interface.carv.io/ai-agent-backend';
const getAuthHeader = () => {
  const apiKey = process.env.CARV_API_KEY;
  if (!apiKey) {
    throw new Error('CARV_API_KEY is not defined in the environment variables.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': apiKey
  };
};

export const carvTools = {
  getNewsFromCarv: tool({
    description: "Get latest news from Carv",
    parameters: z.object({}),
    execute: async () => {
      try {
        const response = await axios.get(`${CARV_API_BASE_URL}/news`, {
          headers: getAuthHeader()
        });
        
        return JSON.stringify(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return `Error fetching news: ${error.message}`;
        }
        return 'Error fetching news: Unknown error occurred';
      }
    }
  }),

  getRecentBlocksFromCarv: tool({
    description: "Get recent Ethereum blocks data from Carv",
    parameters: z.object({
      limit: z.number().optional().describe("Number of blocks to fetch (default: 10)"),
      daysAgo: z.number().optional().describe("Number of days to look back (default: 1)")
    }),
    execute: async ({ limit = 10, daysAgo = 1 }) => {
      try {
        const sqlContent = `SELECT number, timestamp, miner, gas_used, transaction_count 
                            FROM eth.blocks 
                            WHERE date >= date_format(date_add('day', -${daysAgo}, current_date), '%Y-%m-%d') 
                            ORDER BY number DESC 
                            LIMIT ${limit}`;

        const response = await axios.post(`${CARV_API_BASE_URL}/sql_query`, {
          sql_content: sqlContent
        }, {
          headers: getAuthHeader()
        });
        
        return JSON.stringify(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return `Error fetching block data: ${error.message}`;
        }
        return 'Error fetching block data: Unknown error occurred';
      }
    }
  }),

  getHighValueTransactionsFromCarv: tool({
    description: "Get high-value Ethereum transactions data from Carv",
    parameters: z.object({
      minValue: z.number().optional().describe("Minimum ETH value of transactions (default: 10)"),
      daysAgo: z.number().optional().describe("Number of days to look back (default: 7)"),
      limit: z.number().optional().describe("Number of transactions to fetch (default: 15)")
    }),
    execute: async ({ minValue = 10, daysAgo = 7, limit = 15 }) => {
      try {
        const sqlContent = `SELECT hash, from_address, to_address, value, block_timestamp 
                            FROM eth.transactions 
                            WHERE date >= date_format(date_add('day', -${daysAgo}, current_date), '%Y-%m-%d') 
                            AND value > ${minValue} 
                            ORDER BY value DESC 
                            LIMIT ${limit}`;

        const response = await axios.post(`${CARV_API_BASE_URL}/sql_query`, {
          sql_content: sqlContent
        }, {
          headers: getAuthHeader()
        });
        
        return JSON.stringify(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return `Error fetching high-value transactions: ${error.message}`;
        }
        return 'Error fetching high-value transactions: Unknown error occurred';
      }
    }
  }),

  askCarvLlm: tool({
    description: "Ask a blockchain-related question to Carv's language model",
    parameters: z.object({
      question: z.string().describe("The blockchain-related question to ask")
    }),
    execute: async ({ question }) => {
      try {
        const response = await axios.post(`${CARV_API_BASE_URL}/sql_query_by_llm`, {
          question: question
        }, {
          headers: getAuthHeader()
        });
        
        return JSON.stringify(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return `Error querying LLM: ${error.message}`;
        }
        return 'Error querying LLM: Unknown error occurred';
      }
    }
  }),

  getTokenInfoFromCarv: tool({
    description: "Get token information from Carv",
    parameters: z.object({
      ticker: z.string().describe("Token ticker symbol (e.g., 'aave', 'btc')")
    }),
    execute: async ({ ticker }) => {
      try {
        const response = await axios.get(`${CARV_API_BASE_URL}/token_info`, {
          params: { ticker },
          headers: getAuthHeader()
        });
        
        return JSON.stringify(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return `Error fetching token info: ${error.message}`;
        }
        return 'Error fetching token info: Unknown error occurred';
      }
    }
  }),

  runCustomSqlQueryOnCarv: tool({
    description: "Run a custom SQL query on Carv's blockchain data",
    parameters: z.object({
      sqlContent: z.string().describe("SQL query to execute")
    }),
    execute: async ({ sqlContent }) => {
      try {
        const response = await axios.post(`${CARV_API_BASE_URL}/sql_query`, {
          sql_content: sqlContent
        }, {
          headers: getAuthHeader()
        });
        
        return JSON.stringify(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return `Error executing SQL query: ${error.message}`;
        }
        return 'Error executing SQL query: Unknown error occurred';
      }
    }
  })
};
