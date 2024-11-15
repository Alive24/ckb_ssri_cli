import {ccc, Cell, CellDepLike, HasherCkb} from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../libs/config.js'
import {cccA} from '@ckb-ccc/core/advanced'
import axios from 'axios'
import { encodeHex, encodeLockArray, encodeU128Array } from '../../libs/utils.js'

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
    // TODO: Implement fromTransactionJson and holdSend.
    fromTransactionJson: Flags.file({
      description:
        '(NOT IMPLEMENTED YET!) Assemble transaction on the basis of a previous action; use together with holdSend to make multiple transfers within the same transaction.',
    }),
    holdSend: Flags.boolean({
      description:
        '(NOT IMPLEMENTED YET!) Hold the transaction and send it later. Will output the transaction JSON. Use together with fromTransactionJson to make multiple transfers within the same transaction.',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UDTTransfer)

    const cliConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})

    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ??
        cliConfig.accountRegistry[flags.fromAccount ?? '']?.privateKey ??
        process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const {script: changeLock} = await signer.getRecommendedAddressObj()
    const toLock = (await ccc.Address.fromString(args.toAddress, signer.client)).script

    const hasher = new HasherCkb()
    const transferPathHex = hasher.update(Buffer.from('UDT.transfer')).digest().slice(0, 18)

    const udtConfig = cliConfig.UDTRegistry[args.symbol]
    const udtTypeScript = new ccc.Script(udtConfig.code_hash, 'type', udtConfig.args)
    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0]

    const amountBytes = ccc.numLeToBytes(Math.floor(Number(args.toAmount) * 10 ** udtConfig.decimals), 16)
    const amountUint128 = new cccA.moleculeCodecCkb.Uint128(amountBytes)

    const toLockArrayEncoded = cccA.moleculeCodecCkb.SerializeBytesVec([toLock.toBytes()])
    const toLockArrayEncodedHex = encodeHex(new Uint8Array(toLockArrayEncoded))
    this.debug('toLockArrayEncodedHex:', toLockArrayEncodedHex)
    const toAmountArrayEncoded = encodeU128Array([amountUint128])
    this.debug('toAmountArrayEncoded:', toAmountArrayEncoded)
    const toAmountArrayEncodedHex = encodeHex(toAmountArrayEncoded)
    this.debug('toAmountArrayEncodedHex:', toAmountArrayEncodedHex)

    const payload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_script',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        // args.index,
        [transferPathHex, `0x`, `0x${toLockArrayEncodedHex}`, `0x${toAmountArrayEncodedHex}`],
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

      this.log('Response JSON:', response.data)
      // TODO: Prettify response.
    } catch (error) {
      console.error('Request failed', error)
    }

    // const transferTx = ccc.Transaction.from({
    //   outputs: [
    //     {
    //       lock: toLock,
    //       type: udtTypeScript,
    //     },
    //   ],
    //   outputsData: [ccc.numLeToBytes(Math.floor(Number(args.toAmount) * 10 ** udtConfig.decimals), 16)],
    // })
    // await transferTx.completeInputsByUdt(signer, udtTypeScript)
    // const balanceDiff =
    //   (await transferTx.getInputsUdtBalance(signer.client, udtTypeScript)) -
    //   transferTx.getOutputsUdtBalance(udtTypeScript)
    // if (balanceDiff > ccc.Zero) {
    //   transferTx.addOutput(
    //     {
    //       lock: changeLock,
    //       type: udtTypeScript,
    //     },
    //     ccc.numLeToBytes(balanceDiff, 16),
    //   )
    // }
    // await transferTx.completeInputsByCapacity(signer)
    // await transferTx.completeFeeBy(signer)

    // transferTx.addCellDeps(await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))
    // const transferTxTxHash = await signer.sendTransaction(transferTx)

    // this.log(`Transferred ${args.toAmount} ${args.symbol} to ${args.toAddress}. Tx hash: ${transferTxTxHash}`)

    // TODO: Process error.
  }
}
