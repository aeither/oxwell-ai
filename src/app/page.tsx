'use client';

import { ChainId, getQuote } from '@lifi/sdk';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

export default function Home() {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetQuote = async () => {
    try {
      setLoading(true);
      const quoteResult = await getQuote({
        fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        fromChain: ChainId.ARB,
        toChain: ChainId.OPT,
        fromToken: '0x0000000000000000000000000000000000000000',
        toToken: '0x0000000000000000000000000000000000000000',
        fromAmount: '1000000000000000000',
      });
      console.log("🚀 ~ handleGetQuote ~ quoteResult:", quoteResult)
      setQuote(quoteResult);
    } catch (error) {
      console.error('Error getting quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="flex flex-col items-center gap-4">
            <ConnectButton />
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={handleGetQuote}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Getting Quote...' : 'Get Quote'}
            </button>
          </div>
          
          {quote && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-bold mb-2">Quote Details:</h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(quote, null, 2)}
              </pre>
            </div>
          )}
        </div>
  );
}
