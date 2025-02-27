import React, { useState, useEffect } from "react";
import web3 from "./web3";

function CanceledCampaigns({ contract, account }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const cancelledCampaignIds = await contract.methods
          .getCancelledCampaigns()
          .call();

        const cancelledCampaigns = await Promise.all(
          cancelledCampaignIds.map(async (campaignId) => {
            const details = await contract.methods
              .getCampaignDetails(campaignId)
              .call();
            const userShares = await contract.methods
              .backerPledges(campaignId, account)
              .call(); // Use backerPledges mapping

            return {
              id: details[0],
              entrepreneur: details[1],
              title: details[2],
              pledgeCost: web3.utils.fromWei(details[3], "ether"),
              pledgesNeeded: details[4],
              pledgesCount: details[5],
              isFulfilled: details[6], // Use isFulfilled
              isCancelled: details[7],
              userShares: parseInt(userShares),
            };
          })
        );

        setCampaigns(cancelledCampaigns);
      } catch (error) {
        console.error("Error loading canceled campaigns:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contract && account) {
      loadCampaigns();
    }
  }, [contract, account]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // ... rest of the component code
}

export default CanceledCampaigns;
