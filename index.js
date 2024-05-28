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
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "author",
						"type": "address"
					},
					{
						"internalType": "uint32",
						"name": "startBlockNumber",
						"type": "uint32"
					},
					{
						"internalType": "address",
						"name": "executionStrategy",
						"type": "address"
					},
					{
						"internalType": "uint32",
						"name": "minEndBlockNumber",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "maxEndBlockNumber",
						"type": "uint32"
					},
					{
						"internalType": "enum TargetContract.FinalizationStatus",
						"name": "finalizationStatus",
						"type": "uint8"
					},
					{
						"internalType": "bytes32",
						"name": "executionPayloadHash",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "activeVotingStrategies",
						"type": "uint256"
					}
				],
				"internalType": "struct TargetContract.Proposal",
				"name": "proposal",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "executionPayload",
				"type": "bytes"
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
				"name": "executor",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "payload",
				"type": "bytes"
			}
		],
		"name": "executePayload",
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
]; // ABI of your smart contract
const abiinco = [
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
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "execute_payload",
		"type": "event"
	},
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
				"name": "executor",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "payload",
				"type": "bytes"
			}
		],
		"name": "executePayload",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_messageHash",
				"type": "bytes32"
			}
		],
		"name": "getEthSignedMessageHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "getIsExecuted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "getMessageHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "choice",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "publicKey",
				"type": "bytes32"
			}
		],
		"name": "getVotePower",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			}
		],
		"name": "isExecuted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_ethSignedMessageHash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "recoverSigner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "sig",
				"type": "bytes"
			}
		],
		"name": "splitSignature",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_signer",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "pure",
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
const wallet2 = new ethers.Wallet(privateKey, providertarget);

// Connect the wallet to the provider to enable signing transactions
const connectedWallet = wallet.connect(providerinco);
const connectedWallet2 = wallet2.connect(providertarget);


const contracttargetAddress = args[1]; // Address of your smart contractķ
const contracttarget = new ethers.Contract(contracttargetAddress, abitarget, connectedWallet2);

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

contractinco.on("execute_payload", async (executor, payload) => {
    // Extract relevant data from the event
    const executeData = { executor, payload };

    // Initiate transaction on another blockchain
    // Example: sendTransactionToOtherChain(eventData);
    // console.log("execute event:", executeData);

    const maxRetries = 5; // Number of maximum retry attempts
    let retryCount = 0; // Counter to keep track of retry attempts

    while (retryCount < maxRetries) {
    try {
        const txn = await contracttarget.executePayload(executor, payload);
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
