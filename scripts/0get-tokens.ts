import { ChainId, getTokenBalances, getTokens } from '@lifi/sdk';
import { config } from 'dotenv';
import { privateKeyToAccount } from 'viem/accounts';
config();

const main = async () => {
    const account = privateKeyToAccount(`${process.env.PRIVATE_KEY}` as `0x${string}`)

    try {
        const tokensResponse = await getTokens();
        const optimismTokens = tokensResponse.tokens[ChainId.BAS];
        const tokenBalances = await getTokenBalances(account.address, optimismTokens);
        console.log(tokenBalances);
    } catch (error) {
        console.error(error);
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
