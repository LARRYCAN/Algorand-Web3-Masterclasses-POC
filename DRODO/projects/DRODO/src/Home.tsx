// src/components/Home.tsx
import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600">
      <div className="hero-content text-center rounded-lg p-8 md:p-12 max-w-2xl bg-white shadow-xl mx-auto">
        <div className="w-full max-w-xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome to DRODO 🎟️
          </h1>
          <p className="py-6 text-lg text-gray-600">
            Every delivery is a unique digital ticket. Instantly match with a
            verified local provider and get your package moving. Connect, explore
            and get inspired!
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
            {/* Connect Wallet */}
            <button
              data-test-id="connect-wallet"
              className="btn btn-lg bg-blue-500 hover:bg-blue-600 text-white border-0 transition-colors duration-200 w-full md:w-auto"
              onClick={() => setOpenWalletModal(true)}
            >
              Connect Wallet
            </button>

            {/* Show only if wallet connected */}
            {activeAddress && (
              <>
                {/* Send Payment */}
                <button
                  data-test-id="send-payments"
                  className="btn btn-lg bg-purple-500 hover:bg-purple-600 text-white border-0 transition-colors duration-200 w-full md:w-auto"
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Send Payment
                </button>

                {/* Mint NFT */}
                <button
                  data-test-id="mint-nft"
                  className="btn btn-lg bg-lime-500 hover:bg-lime-600 text-white border-0 transition-colors duration-200 w-full md:w-auto"
                  onClick={() => setOpenMintModal(true)}
                >
                  Mint DRODO Pass NFT
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
    </div>
  )
}

export default Home
