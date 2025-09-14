import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { sha512_256 } from 'js-sha512'

interface NFTmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint = ({ openModal, setModalState }: NFTmintProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [metadataUrl, setMetadataUrl] = useState<string>('')

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

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

      const hashBytes = new Uint8Array(Buffer.from(sha512_256.digest(metadataUrl)))

      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'DRODO Pass',
        unitName: 'MTK',
        url: metadataUrl,
        metadataHash: hashBytes,
        defaultFrozen: false,
      })

      enqueueSnackbar(`NFT minted! Asset ID: ${createNFTResult.assetId}`, { variant: 'success' })
      setMetadataUrl('')
    } catch (e) {
      enqueueSnackbar('Failed to mint NFT', { variant: 'error' })
      console.error(e)
    }

    setLoading(false)
  }

  return (
    <dialog id="nft_mint_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint DRODO Pass NFT</h3>
        <br />
        <input
          type="text"
          placeholder="Paste your metadata URL (IPFS via Pinata)"
          className="input input-bordered w-full"
          value={metadataUrl}
          onChange={(e) => setMetadataUrl(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
          <button
            className={`btn ${metadataUrl ? '' : 'btn-disabled'}`}
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
