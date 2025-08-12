// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openTransactModal, setOpenTransactModal] = useState<boolean>(false)
  // State to manage the visibility of the NFT minting modal
  const [openNFTmintModal, setOpenNFTmintModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleTransactModal = () => {
    setOpenTransactModal(!openTransactModal)
  }

  // Function to toggle the NFT minting modal
  const toggleNFTmintModal = () => {
    setOpenNFTmintModal(!openNFTmintModal)
  }

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-teal-400 to-sky-500 p-4">
      <div className="hero-content text-center p-8 lg:p-12 max-w-4xl bg-white shadow-2xl rounded-3xl">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Welcome to <span className="text-teal-500">Xconnect</span> 🎟️
          </h1>
          <p className="py-6 text-lg text-gray-600">
            Every delivery is a unique digital ticket. Instantly match with verified local providers and get your package moving. Connect, explore, and get inspired!
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <button
              data-test-id="connect-wallet"
              className="btn btn-primary btn-lg"
              onClick={toggleWalletModal}
            >
              Connect Wallet
            </button>

            {/* These buttons are only shown after a wallet is connected */}
            {activeAddress && (
              <div className="flex flex-col gap-4">
                {/* Button to open the NFT minting modal, with the correct label */}
                <button
                  data-test-id="mint-nft"
                  className="btn btn-accent btn-lg text-white font-bold"
                  onClick={toggleNFTmintModal}
                >
                  Mint XconnectPass NFT
                </button>
                {/* Button to open the payment modal */}
                <button
                  data-test-id="send-payments"
                  className="btn btn-outline btn-info"
                  onClick={toggleTransactModal}
                >
                  Send Payments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openTransactModal} setModalState={setOpenTransactModal} />
      {/* The NFT minting modal component is rendered here */}
      <NFTmint openModal={openNFTmintModal} setModalState={setOpenNFTmintModal} />
    </div>
  )
}

export default Home