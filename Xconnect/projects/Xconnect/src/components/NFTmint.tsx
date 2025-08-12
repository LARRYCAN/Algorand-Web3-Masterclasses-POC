// src/components/NFTmint.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { sha512_256 } from 'js-sha512'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

// This polyfill is necessary for Buffer to be available in a browser environment
import { Buffer } from 'buffer'

interface NFTmintInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint = ({ openModal, setModalState }: NFTmintInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [metadataUrl, setMetadataUrl] = useState<string>('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const handleMintNFT = async () => {
    setLoading(true)

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      setLoading(false)
      return
    }

    if (!metadataUrl) {
      enqueueSnackbar('Please provide a metadata URL', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar('Minting NFT...', { variant: 'info' })

      // Logic provided by the user
      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'XconnectPass Ticket',
        unitName: 'MTK',
        url: metadataUrl,
        metadataHash: new Uint8Array(Buffer.from(sha512_256.digest(metadataUrl))),
        defaultFrozen: false,
      })

      const assetId = createNFTResult.confirmation?.assetIndex
      if (assetId) {
        enqueueSnackbar(`Successfully minted NFT with asset ID: ${assetId}`, { variant: 'success' })
      } else {
        enqueueSnackbar('Minting transaction successful, but could not retrieve asset ID.', {
          variant: 'success',
        })
      }
      setMetadataUrl('')
    } catch (e) {
      console.error(e)
      enqueueSnackbar('Failed to mint NFT. See console for details.', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog
      id="nft_mint_modal"
      className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint Your XconnectPass NFT</h3>
        <br />
        <input
          type="text"
          data-test-id="metadata-url-input"
          placeholder="Paste your metadata URL (e.g., ipfs://...)"
          className="input input-bordered w-full"
          value={metadataUrl}
          onChange={(e) => setMetadataUrl(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button
            data-test-id="mint-nft-button"
            className={`btn btn-primary ${
              metadataUrl.length > 0 && !loading ? '' : 'btn-disabled'
            }`}
            onClick={handleMintNFT}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Mint NFT'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint