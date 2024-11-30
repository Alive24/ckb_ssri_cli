import {ccc, Cell, CellDep, CellDepLike, HasherCkb} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../../libs/config.js'
import 'dotenv/config'
import {encodeHex, encodeLockArray, encodeU128Array} from '../../../libs/utils.js'
import {cccA} from '@ckb-ccc/core/advanced'
import axios from 'axios'
import { blockchain } from '@ckb-lumos/base'

export default class UDTExtendedMint extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to mint.', required: true}),
    toAddress: Args.string({description: 'file to read', required: true}),
    toAmount: Args.string({
      description: 'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000',
      required: true,
    }),
  }

  // ISSUE: [address:amount quickhand for all to_lock:amount in unrestricted mode for input #30](https://github.com/Alive24/ckb_ssri_cli/issues/30)

  static override description =
    'Mint UDT to an address. Make sure you have the mint permission to the token. It overrides pause list.'

  static override examples = [
    'ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100',
  ]

  static override flags = {
    privateKey: Flags.string({
      description: 'Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
    fromAccount: Flags.string({
      description: 'Use specific account to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
    // ISSUE: [Implement fromTransactionJSON and holdSendToJSON #19](https://github.com/Alive24/ckb_ssri_cli/issues/19).
    fromTransactionJSON: Flags.file({
      description:
        '(NOT IMPLEMENTED YET!) Assemble transaction on the basis of a previous action; use together with holdSend to make multiple transfers within the same transaction.',
    }),
    holdSendToJSON: Flags.file({
      description:
        '(NOT IMPLEMENTED YET!) Hold the transaction and export it to a JSON file. Use together with fromTransactionJson to make multiple transfers within the same transaction.',
    }),
    holdSend: Flags.boolean({
      description:
        '(NOT IMPLEMENTED YET!) Hold the transaction and send it later. When neither holdSend nor holdSendToJSON is set, the transaction will be sent immediately.',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTExtendedMint)

    const CLIConfig = await getCLIConfig(this.config.configDir)
    // ISSUE: [Mainnet support. #22](https://github.com/Alive24/ckb_ssri_cli/issues/22)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})
    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ?? flags.fromAccount !== undefined
        ? CLIConfig.accountRegistry[flags.fromAccount ?? ''].privateKey
        : process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script
    const hasher = new HasherCkb()
    const mintPathHex = hasher.update(Buffer.from('UDTExtended.mint')).digest().slice(0, 18)

    const udtConfig = CLIConfig.UDTRegistry[args.symbol]
    const udtTypeScript = new ccc.Script(udtConfig.code_hash, 'type', udtConfig.args)
    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0]

    const amountBytes = ccc.numLeToBytes(Math.floor(Number(args.toAmount) * 10 ** udtConfig.decimals), 16)
    const amountUint128 = new cccA.moleculeCodecCkb.Uint128(amountBytes)

    const toLockArrayEncoded = encodeLockArray([toLock])
    this.debug('toLockArrayEncoded:', toLockArrayEncoded)
    const toLockArrayEncodedHex = encodeHex(toLockArrayEncoded)
    this.debug('toLockArrayEncodedHex:', toLockArrayEncodedHex)
    const toAmountArrayEncoded = encodeU128Array([amountUint128])
    this.debug('toAmountArrayEncoded:', toAmountArrayEncoded)
    const toAmountArrayEncodedHex = encodeHex(toAmountArrayEncoded)

    // TODO: Placeholder for holdSend and holdSendToJSON. Will make it mint double the amount.
    const heldTx = ccc.Transaction.from({
      version: 0,
      cellDeps: [codeCellDep],
      headerDeps: [],
      inputs: [],
      outputs: [
        {
          lock: toLock,
          type: udtTypeScript,
        },
      ],
      outputsData: [ccc.numLeToBytes(Math.floor(Number(args.toAmount) * 10 ** udtConfig.decimals), 16)],
      witnesses: [],
    })

    const heldTxEncodedHex = encodeHex(heldTx.toBytes())
    
    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_script',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        // args.index,
        [mintPathHex, `0x${heldTxEncodedHex}`, `0x${toLockArrayEncodedHex}`, `0x${toAmountArrayEncodedHex}`],
        // NOTE: field names are wrong when using udtTypeScript.toBytes()
        {
          code_hash: udtTypeScript.codeHash,
          hash_type: udtTypeScript.hashType,
          args: udtTypeScript.args,
        },
      ],
    }

    // ISSUE: [Support minting from proxy lock or other lock for mint. #24](https://github.com/Alive24/ckb_ssri_cli/issues/24)
    // Send POST request
    try {
      const response = await axios.post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      const mintTx = blockchain.Transaction.unpack(response.data.result)
      const cccMintTx = ccc.Transaction.from(mintTx)
      await cccMintTx.completeInputsByCapacity(signer)
      await cccMintTx.completeFeeBy(signer)
      const newCellDep = await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys)
      if (
        cccMintTx.cellDeps.find((cellDep) => {
          if (
            cellDep.outPoint.txHash === newCellDep[0].outPoint.txHash &&
            cellDep.outPoint.index === newCellDep[0].outPoint.index &&
            cellDep.depType === newCellDep[0].depType
          ) {
            return true
          }
        }) === undefined
      ) {
        cccMintTx.addCellDeps(newCellDep)
      }
      const transferTxHash = await signer.sendTransaction(cccMintTx)
      this.log(`Minted ${args.toAmount} ${args.symbol} to ${args.toAddress}. Tx hash: ${transferTxHash}`)
    } catch (error) {
      // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
      console.error('Request failed', error)
    }
  }
}
