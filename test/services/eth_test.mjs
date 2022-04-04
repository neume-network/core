//@format
import test from "ava";

import { translate } from "../../src/services/eth.mjs";

// TODO: Sandbox call with fetch-mock
test("translating rpc call", async t => {
	const method = "eth_getTransactionReceipt";
	const params = [
		"0xed14c3386aea0c5b39ffea466997ff13606eaedf03fe7f431326531f35809d1d"
	];
	const call = await translate(method, params);
	t.truthy(call);
});
