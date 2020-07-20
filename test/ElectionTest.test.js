const chai = require("chai");
const { assert } = require("chai");
const Election = artifacts.require("Election");

contract(Election, (accounts) => {
	const [owner, voter] = accounts;
	let election;
	before(async () => {
		election = await Election.new();
	});
	describe("Check for candidates", () => {
		it("Check if the candidates are initialized properly", async () => {
			const numberOfCandidates = await election.candidatesCount();
			assert.equal(numberOfCandidates, 2);
			const candidate1 = await election.candidates(1);
			assert.equal(candidate1.id.toNumber(), 1);
			assert.equal(candidate1.name, "Candidate 1");
			assert.equal(candidate1.voteCount.toNumber(), 0);
			const candidate2 = await election.candidates(2);
			assert.equal(candidate2.id.toNumber(), 2);
			assert.equal(candidate2.name, "Candidate 2");
			assert.equal(candidate2.voteCount.toNumber(), 0);
		});
	});
});
