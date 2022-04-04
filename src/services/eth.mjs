//@format
import { env } from "process";
import { getTransactionReceipt } from "eth-fun";

const options = {
	url: env.RPC_HTTP_HOST
};

export async function translate(method, params) {
	if (method === "eth_getTransactionReceipt") {
		return await getTransactionReceipt(options, params[0]);
	}
}
