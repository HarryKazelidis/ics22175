import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import NewCampaign from "./NewCampaign";
import LiveCampaigns from "./LiveCampaigns";
import FulfilledCampaigns from "./FulfilledCampaigns";
import CanceledCampaigns from "./CanceledCampaigns";
import AdminPanel from "./AdminPanel";

import contractData from "./Contract";
const { web3, contract } = contractData;

function App() {
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState(null); // State για τον owner
  const [balance, setBalance] = useState(null); // State για το balance
  const [fees, setFees] = useState(null); // State για τα fees

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const ownerAddress = await contract.methods.owner().call();
          setOwner(ownerAddress);

          const contractBalance = await web3.eth.getBalance(
            contract.options.address
          );
          setBalance(web3.utils.fromWei(contractBalance, "ether"));

          const contractFees = await contract.methods
            .getContractBalance()
            .call();
          setFees(web3.utils.fromWei(contractFees, "ether"));

          const specialAdmin = "0x153dfef4355E823dCB0FCc76Efe942BefCa86477";
          setIsOwner(
            accounts[0] === ownerAddress || accounts[0] === specialAdmin
          );

          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
          });
        } catch (error) {
          console.error("Error initializing or fetching data:", error);
        }
      } else {
        console.error("Please install MetaMask");
      }
    };

    init();
  }, []); // Empty dependency array για να τρέξει μόνο μία φορά

  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        account={account}
        owner={owner} // Περνάμε τον owner στο Header
        balance={balance} // Περνάμε το balance στο Header
        fees={fees} // Περνάμε τα fees στο Header
      />

      <NewCampaign
        contract={contract}
        account={account}
        web3={web3}
        isOwner={isOwner}
      />

      <LiveCampaigns
        contract={contract}
        account={account}
        web3={web3}
        isOwner={isOwner}
      />

      <FulfilledCampaigns contract={contract} account={account} />

      <CanceledCampaigns contract={contract} account={account} web3={web3} />

      {isOwner && (
        <AdminPanel contract={contract} account={account} web3={web3} />
      )}
    </div>
  );
}

export default App;
