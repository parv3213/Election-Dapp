const chai = require("chai");
const { assert } = require("chai");
const Election = artifacts.require("Election");

contract(Election, (accounts) => {
	const [owner, voter1, voter2] = accounts;
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
	describe("Vote function", () => {
		it("Voter gets registered", async () => {
			let voterRegistered = await election.voters(voter1);
			assert.equal(voterRegistered, false);
			await election.vote(1, { from: voter1 });
			voterRegistered = await election.voters(voter1);
			assert.equal(voterRegistered, true);
		});
		it("Voter can vote only once", async () => {
			try {
				await election.vote(1, { from: voter1 });
				assert.fail();
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1);
			}
			try {
				await election.vote(2, { from: voter1 });
				assert.fail();
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1);
			}
		});
		it("Vote count of candidate increasing", async () => {
			const candidate1VoteCount = await election.candidates(1);
			assert.equal(candidate1VoteCount.voteCount.toNumber(), 1);
			const candidate2VoteCount = await election.candidates(2);
			assert.equal(candidate2VoteCount.voteCount.toNumber(), 0);
		});
		it("Revert for invalid candidate", async () => {
			try {
				await election.vote(3, { from: voter2 });
				assert.fail();
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1);
			}
			try {
				await election.vote(-10, { from: voter2 });
				assert.fail();
			} catch (e) {
				assert(e.message.indexOf("revert") !== -1);
			}
		});
	});
});
