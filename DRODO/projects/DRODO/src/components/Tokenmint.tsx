import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface TokenmintProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Tokenmint = ({ openModal, setModalState }: TokenmintProps) => {
  const [assetName, setAssetName] = useState<string>("")
  const [unitName, setUnitName] = useState<string>("")
  const [totalSupply, setTotalSupply] = useState<string>("")
  const [decimals, setDecimals] = useState<string>("0")
  const [loading, setLoading] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const handleMintToken = async () => {
    setLoading(true)

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar("Please connect wallet first", { variant: "warning" })
      setLoading(false)
      return
    }

    if (!assetName || !unitName || !totalSupply) {
      enqueueSnackbar("Please fill in all fields", { variant: "warning" })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar("Minting Token...", { variant: "info" })

      // Convert supply based on decimals
      const decimalsBig = BigInt(decimals || "0")
      const onChainTotal = BigInt(totalSupply) * BigInt(10) ** decimalsBig

      const createResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: onChainTotal,
        decimals: Number(decimalsBig),
        assetName,
        unitName,
        defaultFrozen: false,
      })

      enqueueSnackbar(`Token minted! Asset ID: ${createResult.assetId}`, { variant: "success" })

      // Reset form
      setAssetName("")
      setUnitName("")
      setTotalSupply("")
      setDecimals("0")

    } catch (e) {
      enqueueSnackbar("Failed to mint Token", { variant: "error" })
      console.error(e)
    }

    setLoading(false)
  }

  return (
    <dialog id="token_mint_modal" className={`modal ${openModal ? "modal-open" : ""} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint Fungible Token (ASA)</h3>
        <br />

        <input
          type="text"
          placeholder="Asset Name (e.g. nKOBO Token)"
          className="input input-bordered w-full mb-2"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Unit Name (e.g. nKOBO)"
          className="input input-bordered w-full mb-2"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Supply"
          className="input input-bordered w-full mb-2"
          value={totalSupply}
          onChange={(e) => setTotalSupply(e.target.value)}
        />

        <input
          type="number"
          placeholder="Decimals (0 for whole tokens)"
          className="input input-bordered w-full mb-4"
          value={decimals}
          onChange={(e) => setDecimals(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>
          <button
            className={`btn ${assetName && unitName && totalSupply ? "" : "btn-disabled"}`}
            onClick={handleMintToken}
            type="button"
          >
            {loading ? <span className="loading loading-spinner" /> : "Mint Token"}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Tokenmint
