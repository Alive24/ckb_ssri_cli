import {ccc, Cell, CellDepLike, HasherCkb} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../libs/config.js'
import {cccA} from '@ckb-ccc/core/advanced'
import axios from 'axios'
import {decodeHex, encodeHex, encodeLockArray, encodeU128Array} from '../../libs/utils.js'
import {blockchain} from '@ckb-lumos/base'
import {Transaction} from '@ckb-lumos/base/lib/blockchain.js'

export default class UDTTransfer extends Command {
  static override args = {
    symbol: Args.string({description: 'Symbol of UDT to transfer.', required: true}),
    toAddress: Args.string({required: true}),
    toAmount: Args.string({
      description:
        'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000. You can transfer amount like 0.1.',
      required: true,
    }),
  }

  // ISSUE: [address:amount quickhand for all to_lock:amount in unrestricted mode for input #30](https://github.com/Alive24/ckb_ssri_cli/issues/30)


  static override description = 'Transfer UDT to an address. Currently only supports one receiver per command run. '

  static override examples = [
    'ckb_ssri_cli udt:transfer TPUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100',
  ]

  static override flags = {
    privateKey: Flags.string({
      description: 'Use specific private key to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
    }),
    fromAccount: Flags.string({
      description: 'Use specific account to sign. Will use MAIN_WALLET_PRIVATE_KEY from .env by default.',
      char: 'f',
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
    const {args, flags} = await this.parse(UDTTransfer)

    const CLIConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})

    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ??
        CLIConfig.accountRegistry[flags.fromAccount ?? '']?.privateKey ??
        process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const {script: changeLock} = await signer.getRecommendedAddressObj()

    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script
    const hasher = new HasherCkb()
    const transferPathHex = hasher.update(Buffer.from('UDT.transfer')).digest().slice(0, 18)

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

    // TODO: Placeholder for holdSend and holdSendToJSON
    const heldTxEncoded = ccc.Transaction.from({
      version: 0,
      cellDeps: [codeCellDep],
      headerDeps: [],
      inputs: [],
      outputs: [
      ],
      outputsData: [],
      witnesses: [],
    }).toBytes()

    const heldTxEncodedHex = encodeHex(heldTxEncoded)

    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_script',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        // args.index,
        [transferPathHex, `0x${heldTxEncodedHex}`, `0x${toLockArrayEncodedHex}`, `0x${toAmountArrayEncodedHex}`],
        // NOTE: field names are wrong when using udtTypeScript.toBytes()
        {
          code_hash: udtTypeScript.codeHash,
          hash_type: udtTypeScript.hashType,
          args: udtTypeScript.args,
        },
      ],
    }

    // Send POST request
    try {
      const response = await axios.post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })


      const transferTx = blockchain.Transaction.unpack(response.data.result)
      const cccTransferTx = ccc.Transaction.from(transferTx)
      await cccTransferTx.completeInputsByUdt(signer, udtTypeScript)
      const balanceDiff =
        (await cccTransferTx.getInputsUdtBalance(signer.client, udtTypeScript)) -
        cccTransferTx.getOutputsUdtBalance(udtTypeScript)
      if (balanceDiff > ccc.Zero) {
        cccTransferTx.addOutput(
          {
            lock: changeLock,
            type: udtTypeScript,
          },
          ccc.numLeToBytes(balanceDiff, 16),
        )
      }
      await cccTransferTx.completeInputsByCapacity(signer)
      await cccTransferTx.completeFeeBy(signer)
      const newCellDep = await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys)
      if (
        cccTransferTx.cellDeps.find((cellDep) => {
          if (
            cellDep.outPoint.txHash === newCellDep[0].outPoint.txHash &&
            cellDep.outPoint.index === newCellDep[0].outPoint.index &&
            cellDep.depType === newCellDep[0].depType
          ) {
            return true
          }
        }) === undefined
      ) {
        cccTransferTx.addCellDeps(newCellDep)
      }
      const transferTxHash = await signer.sendTransaction(cccTransferTx)
      this.log(`Transferred ${args.toAmount} ${args.symbol} to ${args.toAddress}. Tx hash: ${transferTxHash}`)
    } catch (error) {
      // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
      console.error('Request failed', error)
    }
  }
}
