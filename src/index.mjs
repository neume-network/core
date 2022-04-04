// @format

import { toHex, getBlockByNumber, getTransactionReceipt } from "eth-fun";

const options = {
	url: "https://cloudflare-eth.com",
};

(async () => {
	const includeTxBodies = false;
	const blockNumber = toHex(14518730);
	const block = await getBlockByNumber(options, blockNumber, includeTxBodies);
	const tx0 = block.transactions[0];

	const receipt = await getTransactionReceipt(options, tx0);
	console.log(receipt, receipt.logs[0].topics);
})();
