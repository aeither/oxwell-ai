import { config } from 'dotenv';
config();

import { getToken, getTokenBalance } from '@lifi/sdk';
const main = async () => {

    const chainId = 1;
    const tokenAddress = '0x0000000000000000000000000000000000000000';
    const walletAddress = '0x30792C5af22147d47F009B868D6630b10C24c5A0';
    console.log("🚀 ~ main ~ token!!!:")

    try {
        const token = await getToken(chainId, tokenAddress);
        console.log("🚀 ~ main ~ token:", token)
        const tokenBalance = await getTokenBalance(walletAddress, token);
        console.log(tokenBalance);
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
