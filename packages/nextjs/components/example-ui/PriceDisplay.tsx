"use client";

import { useCallback, useEffect, useState } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { getSignersForDataServiceId } from "@redstone-finance/sdk";
import { ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PriceDisplayProps {
  symbol: "ETH" | "BTC";
}

export const PriceDisplay = ({ symbol }: PriceDisplayProps) => {
  const [price, setPrice] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: deployedContractData } = useDeployedContractInfo("PriceFeed");

  const fetchPrice = useCallback(async () => {
    if (!deployedContractData) {
      setError("PriceFeed contract not deployed. Run: yarn deploy");
      setIsLoading(false);
      return;
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please connect your wallet to view prices");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider);

      const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
        dataPackagesIds: [symbol],
        authorizedSigners: getSignersForDataServiceId("redstone-main-demo"),
      });
      const priceData = symbol === "ETH" ? await wrappedContract.getEthPrice() : await wrappedContract.getBtcPrice();

      if (!priceData) {
        throw new Error("No price data returned from oracle");
      }

      const formattedPrice = (Number(priceData) / 1e8).toFixed(2);
      setPrice(formattedPrice);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching price:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch price");
    } finally {
      setIsLoading(false);
    }
  }, [deployedContractData, symbol]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">{symbol}/USD</h2>

        {error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Current Price</div>
              <div className="stat-value text-white">${price}</div>
              <div className="stat-desc">Updated: {lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        )}

        <div className="card-actions justify-end">
          <button className="btn btn-sm btn-outline" onClick={fetchPrice} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
};
