import "./App.css";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages";
import CreateNFT from "./pages/create-nft";
import Footer from "./components/Footer";
import React, { useEffect, useState } from "react";
import { BrowserWallet } from "@meshsdk/core";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { useDispatch } from "react-redux";
import MarketPlace from "./components/MarketPlace";

export const WalletContext = React.createContext<BrowserWallet | null>(null);
function App() {
  const { walletId } = useSelector((state: RootState) => state.wallet);

  const [wallet, setWallet] = useState<BrowserWallet | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const reconnectWallet = async () => {
    if (!walletId) {
      setWallet(null); // This line is important to clear context
      return;
    }

    const availableWallets = await BrowserWallet.getAvailableWallets();
    const selectedWallet = availableWallets.find(
      (wallet) => wallet.id === walletId
    );

    if (!selectedWallet) {
      console.log(`Wallet with ID ${walletId} not found.`);
      setWallet(null);
      return;
    }

    const connectedWallet = await BrowserWallet.enable(walletId);
    setWallet(connectedWallet);
  };

  // Use useEffect to reconnect the wallet when the component mounts or when walletId changes
  // const role = useSelector((state: RootState) => state.auth.role);
  // const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
  useEffect(() => {
    reconnectWallet();
  }, [walletId, dispatch]);

  return (
    <WalletContext.Provider value={wallet}>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar at the top */}
          <Navbar />

          {/* Main content area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-nft" element={<CreateNFT />} />
              <Route path="/market-place" element={<MarketPlace />} />
            </Routes>
          </main>

          {/* Footer at the bottom */}
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </WalletContext.Provider>
  );
}

export default App;
