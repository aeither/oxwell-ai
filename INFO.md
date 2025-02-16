# Quote vs Route

quote is one step, route is multiple steps.

# Test

get quotes from 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125 on chain id 42161 from 1000000000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0x0000000000000000000000000000000000000000 on chain id 10

execute a lifi route from 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125 on chain id 42161 from 10000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0x0000000000000000000000000000000000000000 on chain id 5000

--

Bridge from chain Base for 10000000000000 of nativetoken to native token to avax 

get quotes for swapping 1 mnt for eth on mantle

Bridge from chain Base for 10000000000000 of token 0x0000000000000000000000000000000000000000 to 0x0000000000000000000000000000000000000000 to bsc 

More Natural Queries

get quotes for swapping native token MNT for WETH on Mantle
get quotes for swapping native token MNT for WETH on Mantle from address 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125

get quotes for swapping native token for 0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111 on Chain Id 5000 from address 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125

get quotes from 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125 on chain id 5000. from 1000000000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111

swap from 0xA830Cd34D83C10Ba3A8bB2F25ff8BBae9BcD0125 on chain id 5000. from 1000000000000000000 for token 0x0000000000000000000000000000000000000000 amount to 0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111

TODO:

Individuating chain
- get chain id from chain name. Use chainInfo.
  
get owner address
- I can add in the user message in the FE.

Token Symbol to Address
- Know if Symbol is Native Token then 0x0000000000000000000000000000000000000000. Use chainInfo to match chain info with user providedchain name
- If not native replace with address of the corrisponding chain

