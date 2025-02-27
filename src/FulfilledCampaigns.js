import React, { useState, useEffect } from "react";
import web3 from "./web3";

function FulfilledCampaigns({ contract, account }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true); // Set loading to true while fetching data
      setError(null); // Clear any previous errors
      try {
        const completedCampaignIds = await contract.methods
          .getCompletedCampaigns()
          .call();

        const fulfilledCampaigns = await Promise.all(
          completedCampaignIds.map(async (campaignId) => {
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
              pledgeCost: web3.utils.fromWei(details[3], "ether"), // Use pledgeCost
              pledgesNeeded: details[4],
              pledgesCount: details[5],
              isFulfilled: details[6], // Use isFulfilled
              isCancelled: details[7],
              userShares: parseInt(userShares),
            };
          })
        );

        setCampaigns(fulfilledCampaigns);
      } catch (error) {
        console.error("Error loading fulfilled campaigns:", error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (contract && account) {
      loadCampaigns();
    }
  }, [contract, account]);

  if (loading) {
    // Display loading message
    return <div>Loading...</div>;
  }

  if (error) {
    // Display error message
    return <div>Error: {error}</div>;
  }

  // ... rest of the component code (rendering the campaigns)
}

export default FulfilledCampaigns;
