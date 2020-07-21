import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Election from "../abis/Election.json";

export default function App() {
	let content;
	const [account, setAccount] = useState("");
	const [electionContract, setElectionContract] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadBlockchainData();
	}, []);

	const loadBlockchainData = async () => {
		const possible = await loadWeb3();
		if (!possible) return;
		const web3 = window.web3;
		const _accounts = await web3.eth.getAccounts();
		setAccount(_accounts[0]);
		const _networkId = await web3.eth.net.getId();
		const _electionData = Election.networks[_networkId];
		if (_electionData) {
			const _electionContract = new web3.eth.Contract(Election.abi, _electionData.address);
			setElectionContract(_electionContract);
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

	if (!loading) {
		content = <p>Hey</p>;
	} else {
		content = <p>Loading...</p>;
	}

	return <div>{content}</div>;
}
