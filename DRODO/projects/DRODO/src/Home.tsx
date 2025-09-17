// src/components/Home.tsx
import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  // Define a consistent button style for all action buttons (now explicitly full-width)
  const mobileActionButtonClass = "btn transition-colors duration-200 w-full font-semibold h-12"

  return (
    // Max width adjusted to better simulate a constrained mobile frame on a larger screen,
    // though the responsiveness will ensure it looks good on any device.
    <div className="hero min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-4">
      <div className="hero-content text-center rounded-lg p-8 md:p-10 max-w-sm sm:max-w-md bg-white shadow-2xl mx-auto w-full">
        <div className="w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome to DRODO 🎟️
          </h1>
          <p className="py-6 text-base text-gray-600">
            Every delivery is a unique digital ticket. Instantly match with a
            verified local provider and get your package moving.
          </p>

          <div className="mt-6">
            {activeAddress ? (
              // --- CONNECTED STATE (Mobile Action Screen): VERTICALLY STACKED ---
              <div className="flex flex-col space-y-3">
                
                {/* 1. Connect Wallet Button (Status/Re-connect) */}
                <button
                  data-test-id="connect-wallet-status"
                  className={`${mobileActionButtonClass} bg-green-500 hover:bg-green-600 text-white border-0`}
                  onClick={() => setOpenWalletModal(true)}
                >
                  Wallet Connected
                </button>

                {/* 2. Send Payment */}
                <button
                  data-test-id="send-payments"
                  className={`${mobileActionButtonClass} bg-purple-500 hover:bg-purple-600 text-white border-0`}
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Send Payment
                </button>

                {/* 3. Mint NFT */}
                <button
                  data-test-id="mint-nft"
                  className={`${mobileActionButtonClass} bg-lime-500 hover:bg-lime-600 text-white border-0`}
                  onClick={() => setOpenMintModal(true)}
                >
                  Mint DRODO Pass NFT
                </button>
                
                {/* 4. Create Token (ASA) */}
                <button
                  data-test-id="create-token"
                  className={`${mobileActionButtonClass} bg-orange-500 hover:bg-orange-600 text-white border-0`}
                  onClick={() => setOpenTokenModal(true)}
                >
                  Create Token (ASA)
                </button>
              </div>
            ) : (
              // --- DISCONNECTED STATE (Mobile Onboarding Screen) ---
              <div className="p-6 border-4 border-double border-blue-500 rounded-xl bg-blue-50/50 shadow-lg">
                <p className="mb-6 text-lg font-semibold text-blue-800">
                  Please connect your wallet to unlock all features.
                </p>
                <button
                  data-test-id="connect-wallet-onboard"
                  className="btn btn-lg bg-blue-500 hover:bg-blue-600 text-white border-0 transition-colors duration-200 w-full shadow-md hover:shadow-lg"
                  onClick={() => setOpenWalletModal(true)}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
    </div>
  )
}

export default Home