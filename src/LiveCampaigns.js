import React, { useState, useEffect } from "react";
import web3 from "./web3"; // Make sure this path is correct

function LiveCampaigns({ contract, account, campaignCount, web3 }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!contract || !account || !campaignCount || !web3) {
          return; // Wait for contract and account to be available
        }

        const liveCampaigns = [];
        for (let i = 1; i <= campaignCount; i++) {
          const details = await contract.methods.getCampaignDetails(i).call();

          // Check if details is defined and has the necessary elements
          if (details && details.length > 8) {
            const isLive = !details[6] && !details[7];

            if (isLive) {
              const campaignData = await contract.methods.campaigns(i).call(); // Get campaign data
              const userPledges =
                campaignData && campaignData.backerPledges
                  ? await campaignData.backerPledges(account).call()
                  : 0; // Handle undefined campaignData

              liveCampaigns.push({
                id: details[0],
                entrepreneur: details[1],
                title: details[2],
                pledgeCost: web3.utils.fromWei(details[3], "ether"),
                pledgesNeeded: details[4],
                pledgesCount: details[5],
                isFulfilled: details[6],
                isCancelled: details[7],
                userPledges: parseInt(userPledges),
                backers: details[8], // Include backers for debugging
              });
            }
          } else {
            console.warn("Invalid campaign details received:", details);
          }
        }
        setCampaigns(liveCampaigns);
      } catch (err) {
        console.error("Error loading live campaigns:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns(); // Call the function
  }, [contract, account, campaignCount, web3]); // Add web3 to the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="section">
      <h2 className="section-title">Live Campaigns</h2>
      <table>
        {/* ... (table header) */}
        <tbody>
          {campaigns &&
            campaigns.map(
              (
                campaign // Check if campaigns is defined
              ) => (
                <tr key={campaign.id}>
                  {/* ... (table cells) */}
                  <td>
                    {campaign.backers &&
                    Array.isArray(campaign.backers) &&
                    campaign.backers.includes(account)
                      ? "Pledged"
                      : "Not Pledged"}
                  </td>
                  {/* ... (rest of the table cells) */}
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default LiveCampaigns;
