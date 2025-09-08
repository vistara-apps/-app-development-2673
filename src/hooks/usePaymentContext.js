import { useWalletClient } from "wagmi";
import { useCallback } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();

  const createSession = useCallback(async () => {
    if (!walletClient || !walletClient.account) throw new Error("Please connect your wallet");
    if (isError) throw new Error("Wallet not connected");
    if (isLoading) throw new Error("Wallet is loading");
    
    const baseClient = axios.create({
      baseURL: "https://payments.vistara.dev",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const apiClient = withPaymentInterceptor(baseClient, walletClient);
    const response = await apiClient.post("/api/payment", { amount: "$0.50" });
    
    const paymentResponse = response.config.headers["X-PAYMENT"];
    if (!paymentResponse) throw new Error("Payment response is absent");
    
    const decoded = decodeXPaymentResponse(paymentResponse);
    console.log(`Payment successful: ${JSON.stringify(decoded)}`);
    
    return decoded;
  }, [walletClient, isError, isLoading]);

  return { createSession };
}