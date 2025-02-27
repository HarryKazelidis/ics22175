import React from "react";

function Header({ account, owner, balance, fees }) {
  // Receive owner, balance, and fees props
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* ... (Your address) */}

        <div>
          <h3 className="font-bold">Contract Owner:</h3>
          <p className="text-sm break-all">{owner || "Loading..."}</p>{" "}
          {/* Use owner prop */}
        </div>

        <div>
          <h3 className="font-bold">Your Address:</h3>
          <p className="text-sm break-all">{account}</p>
        </div>

        <div>
          <h3 className="font-bold">Contract Balance:</h3>
          <p>{balance || "Loading..."} ETH</p> {/* Use balance prop */}
        </div>

        <div>
          <h3 className="font-bold">Fees Balance:</h3>
          <p>{fees || "Loading..."} ETH</p> {/* Use fees prop */}
        </div>
      </div>
    </div>
  );
}

export default Header;
