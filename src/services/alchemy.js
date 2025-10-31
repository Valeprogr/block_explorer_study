import { alchemy } from "../config/Alchemy";

export const getBlockNumber = async () => {
    const blockNumber = await alchemy.core.getBlockNumber();
    return blockNumber;
}

// alchemy.core.getBlock()
// alchemy.core.getBlockWithTransactions() 
// alchemy.core.getTransactionReceipt()

export const getBlockInfo = async (blockNumber) => {
    const blockInfo = await alchemy.core.getBlock(blockNumber);
    return blockInfo;
}

export const getBlockWithTransactions = async (blockNumber) => {
    const blockWithTransactions = await alchemy.core.getBlockWithTransactions(blockNumber);
    return blockWithTransactions;
}

export const getTransactionReceipt = async (txHash) => {
    const transactionReceipt = await alchemy.core.getTransactionReceipt(txHash);
    return transactionReceipt;
}

