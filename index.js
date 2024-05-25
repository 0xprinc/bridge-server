const { ethers } = require("ethers");
require('dotenv').config();

// Get the command line arguments
const args = process.argv.slice(2); // slice(2) removes the first two elements, which are 'node' and the script name

// Ensure the correct number of arguments are provided
if (args.length !== 2) {
    console.error('Usage: node index.js <contractincoAddress> <contracttargetAddress>');
    process.exit(1);
}

// const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/34a4492831dd405f9d6b9ab19a31c8de");
const providertarget = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
const providerinco = new ethers.providers.JsonRpcProvider("https://testnet.inco.org");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


// Define smart contract interface and address
const abitarget = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "execute_init",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "vote_init",
		"type": "event"
	}
]; // ABI of your smart contract
const abiinco = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "proposal",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "executionPayload",
				"type": "bytes"
			},
			{
				"internalType": "uint32",
				"name": "blocknumber",
				"type": "uint32"
			}
		],
		"name": "execute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "votingPower",
				"type": "uint32"
			},
			{
				"internalType": "bytes",
				"name": "choice",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];



const privateKey = process.env.PRIVATE_KEY; // Replace with your private key
// Create a wallet using the private key
const wallet = new ethers.Wallet(privateKey, providerinco);

// Connect the wallet to the provider to enable signing transactions
const connectedWallet = wallet.connect(providerinco);


const contracttargetAddress = args[1]; // Address of your smart contractķ
const contracttarget = new ethers.Contract(contracttargetAddress, abitarget, providertarget);

const contractincoAddress = args[0]; // Address of your smart contract
const contractinco = new ethers.Contract(contractincoAddress, abiinco, connectedWallet);

console.log("incoEndpointAddress:", contractincoAddress);
console.log("targetContractAddress:", contracttargetAddress);

// Subscribe to smart contract events
contracttarget.on("vote_init", async (voter, proposalId, votingPower, choice, signature) => {
    // Extract relevant data from the event
    const voteData = { voter, proposalId, votingPower, choice, signature };

    // Initiate transaction on another blockchain
    // Example: sendTransactionToOtherChain(eventData);
    // console.log("vote event:", votecounter);


        const maxRetries = 4; // Number of maximum retry attempts
        let retryCount = 0; // Counter to keep track of retry attempts

    while (retryCount < maxRetries) {
        try {
            const txn = await contractinco.vote(voter, proposalId, votingPower, choice, signature);
            console.log("Transaction hash:", txn.hash);

            // Wait for 1 confirmation (adjust confirmations as needed)
            await txn.wait(1);
            console.log("Transaction successful!");

            // Exit the loop if transaction is successful
            break;
        } catch (error) {

            // Increment the retry count
            retryCount++;

            if (retryCount < maxRetries) {
                console.log(`Retrying transaction, attempt ${retryCount} of ${maxRetries}`);
                // Add a delay before retrying (optional)
                await delay(5000); // Wait for 5 seconds before retrying (adjust delay as needed)
            } else {
                console.error(`Maximum retry attempts (${maxRetries}) reached. Exiting.`);
                // Handle the error appropriately (e.g., notify user, exit)
                console.error("Transaction failed:", error);
                break;
            }
            }
        }

});

contracttarget.on("execute_init", async (proposalId, bProposal, executionPayload) => {
    // Extract relevant data from the event
    const executeData = { proposalId, bProposal, executionPayload };

    // Initiate transaction on another blockchain
    // Example: sendTransactionToOtherChain(eventData);
    // console.log("execute event:", executeData);

    const maxRetries = 5; // Number of maximum retry attempts
    let retryCount = 0; // Counter to keep track of retry attempts

    while (retryCount < maxRetries) {
    try {
        const txn = await contractinco.execute(proposalId, bProposal, executionPayload, await providertarget.getBlockNumber());
        console.log("Transaction hash:", txn.hash);

        // Wait for 1 confirmation (adjust confirmations as needed)
        await txn.wait(1);
        console.log("Transaction successful!");

        // Exit the loop if transaction is successful
        break;
    } catch (error) {

        // Increment the retry count
        retryCount++;

        if (retryCount < maxRetries) {
            console.log(`Retrying transaction, attempt ${retryCount} of ${maxRetries}`);
            // Add a delay before retrying (optional)
            await delay(5000); // Wait for 5 seconds before retrying (adjust delay as needed)
        } else {
            console.error(`Maximum retry attempts (${maxRetries}) reached. Exiting.`);
            // Handle the error appropriately (e.g., notify user, exit)
            console.error("Transaction failed:", error);
            break;
        }
        }
    }


});

console.log("Listening for events...");

// Keep the script running indefinitely
process.stdin.resume();
