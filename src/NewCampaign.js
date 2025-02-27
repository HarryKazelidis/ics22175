// components/NewCampaign.js
import React, { useState } from "react";

function NewCampaign({ contract, account, web3, isOwner, onCampaignCreated }) {
  // Προσθέτουμε το onCampaignCreated prop
  const [title, setTitle] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [totalShares, setTotalShares] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !account) return;

    try {
      setLoading(true);
      const sharePriceWei = web3.utils.toWei(sharePrice, "ether");
      const creationFee = web3.utils.toWei("0.02", "ether");

      await contract.methods
        .createCampaign(title, sharePriceWei, totalShares)
        .send({
          from: account,
          value: creationFee,
        });

      setTitle("");
      setSharePrice("");
      setTotalShares("");

      // **ΚΑΛΟΥΜΕ ΤΗ ΣΥΝΑΡΤΗΣΗ onCampaignCreated**
      if (onCampaignCreated) {
        onCampaignCreated();
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">New Campaign</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isOwner || loading}
          />
        </div>

        <div>
          <label className="block mb-2">Share Price (ETH):</label>
          <input
            type="number"
            step="0.000000000000000001"
            value={sharePrice}
            onChange={(e) => setSharePrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isOwner || loading}
          />
        </div>

        <div>
          <label className="block mb-2">Total Shares:</label>
          <input
            type="number"
            value={totalShares}
            onChange={(e) => setTotalShares(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isOwner || loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded ${
            isOwner
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={isOwner || loading}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}

export default NewCampaign;
