import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Election from "../abis/Election.json";
import Header from "./Header";
import Body from "./Body";

export default function App() {
	let content;
	const [account, setAccount] = useState("");
	const [electionContract, setElectionContract] = useState("");
	const [candidate1Votes, setCandidate1Votes] = useState();
	const [candidate2Votes, setCandidate2Votes] = useState();
	const [winner, setWinner] = useState("");
	const [loading, setLoading] = useState(true);
	const [reload, setReload] = useState(true);

	useEffect(() => {
		loadWeb3().then((possible) => {
			if (possible) loadBlockchainData();
		});
	}, [reload]);

	const loadBlockchainData = async () => {
		// const possible = await loadWeb3();
		// if (!possible) return window.alert("App will not load");
		console.log("Fields Updated!");
		const web3 = window.web3;
		const _accounts = await web3.eth.getAccounts();
		setAccount(_accounts[0]);
		const _networkId = await web3.eth.net.getId();
		const _electionData = Election.networks[_networkId];
		if (_electionData) {
			const _electionContract = new web3.eth.Contract(Election.abi, _electionData.address);
			setElectionContract(_electionContract);
			const _candidate1 = await _electionContract.methods.candidates(1).call();
			const _candidate1Votes = Number(_candidate1.voteCount);
			setCandidate1Votes(_candidate1Votes);
			const _candidate2 = await _electionContract.methods.candidates(2).call();
			const _candidate2Votes = Number(_candidate2.voteCount);
			setCandidate2Votes(_candidate2Votes);
			if (_candidate1Votes > _candidate2Votes) setWinner("Candidate 1");
			else if (_candidate1Votes < _candidate2Votes) setWinner("Candidate 2");
			else setWinner("No one");
		} else {
			return window.alert("Token network not detected!\nApp will not load");
		}
		setLoading(false);
	};

	const loadWeb3 = async () => {
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			try {
				await window.ethereum.enable();
			} catch (error) {
				console.log("Error:", error);
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}
		// Non-dapp browsers...
		else {
			window.alert(
				"ATTENTION!\nApplication will not load. Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
			return 0;
		}
		return 1;
	};

	const castVote = async (candidate) => {
		setLoading(true);
		await electionContract.methods
			.vote(candidate)
			.send({ from: account })
			.on("transactionHash", (hash) => {
				console.log("Transaction Successful", hash);
				setReload(!reload);
			});

		// setLoading(false)
	};

	if (!loading) {
		content = (
			<Body
				account={account}
				castVote={castVote}
				winner={winner}
				candidate1Votes={candidate1Votes}
				candidate2Votes={candidate2Votes}
			/>
		);
	} else {
		content = <p className="text-center my-4">Loading...</p>;
	}

	return (
		<div>
			<Header />
			{content}
		</div>
	);
}
