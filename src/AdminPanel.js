// components/AdminPanel.js
import React, { useState } from "react";

function AdminPanel({ contract, account, web3 }) {
  const [newOwner, setNewOwner] = useState("");
  const [banAddress, setBanAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!contract || loading) return;

    try {
      setLoading(true);
      await contract.methods.withdrawFees().send({
        from: account,
      });
    } catch (error) {
      console.error("Error withdrawing fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOwner = async () => {
    if (!contract || loading || !web3.utils.isAddress(newOwner)) return;

    try {
      setLoading(true);
      await contract.methods.changeOwner(newOwner).send({
        from: account,
      });
      setNewOwner("");
    } catch (error) {
      console.error("Error changing owner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanEntrepreneur = async () => {
    if (!contract || loading || !web3.utils.isAddress(banAddress)) return;

    try {
      setLoading(true);
      await contract.methods.banEntrepreneur(banAddress).send({
        from: account,
      });
      setBanAddress("");
    } catch (error) {
      console.error("Error banning entrepreneur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDestroy = async () => {
    if (!contract || loading) return;

    try {
      setLoading(true);
      await contract.methods.destroyContract().send({
        from: account,
      });
    } catch (error) {
      console.error("Error destroying contract:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Withdraw Fees
          </button>
        </div>

        <div>
          <input
            type="text"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="New owner address"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleChangeOwner}
            disabled={loading || !web3.utils.isAddress(newOwner)}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Change Owner
          </button>
        </div>

        <div>
          <input
            type="text"
            value={banAddress}
            onChange={(e) => setBanAddress(e.target.value)}
            placeholder="Address to ban"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleBanEntrepreneur}
            disabled={loading || !web3.utils.isAddress(banAddress)}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Ban Entrepreneur
          </button>
        </div>

        <div>
          <button
            onClick={handleDestroy}
            disabled={loading}
            className="w-full bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Destroy Contract
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
