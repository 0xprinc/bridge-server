const { ethers } = require("ethers");

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
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "ReceivedMessage",
		"type": "event"
	},
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
			}
		],
		"name": "counter_choice_vote",
		"type": "event"
	},
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
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "counter_execute",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "destinationContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "domainId",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
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
		"inputs": [],
		"name": "executecounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_origin",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "_sender",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "handle",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_destinationContract",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastData",
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
		"inputs": [],
		"name": "lastSender",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mailbox",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
		"name": "sendMessage",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_hook",
				"type": "address"
			}
		],
		"name": "setHook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_module",
				"type": "address"
			}
		],
		"name": "setInterchainSecurityModule",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"internalType": "uint32",
				"name": "votingPower",
				"type": "uint32"
			},
			{
				"internalType": "bytes",
				"name": "choice",
				"type": "bytes"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votecounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // ABI of your smart contract
const abiinco = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "ReceivedMessage",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "collectChoiceData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "votingPower",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "collectChoiceHashStatus",
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
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "collectExecuteData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "executionPayload",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "collectExecuteHashStatus",
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
		"inputs": [],
		"name": "destinationContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "domainId",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "proposalhash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "proposal",
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
				"internalType": "bytes",
				"name": "choiceHash",
				"type": "bytes"
			}
		],
		"name": "getCollectChoiceData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "proposalId",
						"type": "uint256"
					},
					{
						"internalType": "uint32",
						"name": "votingPower",
						"type": "uint32"
					}
				],
				"internalType": "struct IncoContract.choiceData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "choiceHash",
				"type": "bytes"
			}
		],
		"name": "getCollectChoiceHashStatus",
		"outputs": [
			{
				"internalType": "bool[2]",
				"name": "",
				"type": "bool[2]"
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
				"internalType": "uint32",
				"name": "_origin",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "_sender",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "handle",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_destinationContract",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"inputs": [],
		"name": "lastData",
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
		"inputs": [],
		"name": "lastSender",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mailbox",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
		"name": "sendMessage",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "choiceHash",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "choice",
				"type": "bytes"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
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
			}
		],
		"name": "votePower",
		"outputs": [
			{
				"internalType": "euint32",
				"name": "votePower",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const privateKey = "your private key"; // Replace with your private key

// Create a wallet using the private key
const wallet = new ethers.Wallet(privateKey, providerinco);

// Connect the wallet to the provider to enable signing transactions
const connectedWallet = wallet.connect(providerinco);


const contracttargetAddress = "0x2d8aEc5a11dFEFBc278C4199A445555cb21Fb9B0"; // Address of your smart contract
const contracttarget = new ethers.Contract(contracttargetAddress, abitarget, providertarget);

const contractincoAddress = "0xB14f2681d8A6412579ae651d486Ffe882F670F73"; // Address of your smart contract
const contractinco = new ethers.Contract(contractincoAddress, abiinco, connectedWallet);

// Subscribe to smart contract events
contracttarget.on("counter_choice_vote", async (votecounter, data) => {
    // Extract relevant data from the event
    const voteData = { votecounter, data };

    // Initiate transaction on another blockchain
    // Example: sendTransactionToOtherChain(eventData);
    console.log("vote event:", votecounter);

    // try {
    //     const txn = await contractinco.vote(ethers.utils.keccak256(data), data);
    //     console.log("Transaction hash:", txn.hash);
  
    //     // Wait for 1 confirmation (adjust confirmations as needed)
    //     await txn.wait(1);
    //     console.log("txn successful!");
    //   } catch (error) {
    //     console.error("txn failed:", error);
    //     // Handle the error appropriately (e.g., retry, notify user)
    //   }


        const maxRetries = 4; // Number of maximum retry attempts
        let retryCount = 0; // Counter to keep track of retry attempts

    while (retryCount < maxRetries) {
        try {
            const txn = await contractinco.vote(ethers.utils.keccak256(data), data);
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

contracttarget.on("counter_execute", async (executecounter, proposal, proposalhash) => {
    // Extract relevant data from the event
    const executeData = { executecounter, proposal, proposalhash };

    // Initiate transaction on another blockchain
    // Example: sendTransactionToOtherChain(eventData);
    console.log("execute event:", executeData);

    const maxRetries = 4; // Number of maximum retry attempts
    let retryCount = 0; // Counter to keep track of retry attempts

    while (retryCount < maxRetries) {
    try {
        const txn = await contractinco.execute(proposalhash, proposal);
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
