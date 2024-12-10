import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../libs/config.js'
import {ccc, Cell, CellOutputLike, fixedPointFrom, HasherCkb, numToBytes} from '@ckb-ccc/core'
import {ClientCollectableSearchKeyLike, cccA} from '@ckb-ccc/core/advanced'
// TODO: Switch to codec in CCC.
import {Byte32, Bytes, BytesVec, Script} from '@ckb-lumos/base/lib/blockchain.js'
import axios from 'axios'
import {blockchain} from '@ckb-lumos/base'
import {encodeHex, encodeU832Array} from '../../libs/utils.js'
import {array, option, table, vector} from '@ckb-lumos/codec/lib/molecule/layout.js'
import {BIish, Uint8} from '@ckb-lumos/codec/lib/number/uint.js'
import {decodeHex} from '../../libs/utils.js'

export default class DevModifyData extends Command {
  static override args = {
    symbol: Args.string({
      description: 'Symbol of UDT to unpause. ',
      required: true,
    }),
    lock_hash: Args.string({description: 'Lock hash in hex. Variable length'}),
  }

  static strict = false

  static override description =
    'Add a lock_hash to pause list. If UDTPausable.enumerate_paused() returns a list of only one UDTPausableData in the vec which means there is no external pausable data cell, a new pausable data cell will be created but manual reference in the contract code is required. NOTE: You cannot use holdSend for more than one pause/pause action in the same transaction, and results of pause/unpause would only take effect after the transaction is confirmed.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    fromTransactionJSON: Flags.file({
      description:
        '(NOT IMPLEMENTED YET!) Assemble transaction on the basis of a previous action; use together with holdSend to make multiple transfers within the same transaction.',
      exists: true,
    }),
    holdSendToJSON: Flags.file({
      description:
        '(NOT IMPLEMENTED YET!) Hold the transaction and send it later. Will output the transaction JSON. Use together with fromTransactionJson to make multiple transfers within the same transaction.',
      exists: false,
    }),
    holdSend: Flags.boolean({
      description:
        '(NOT IMPLEMENTED YET!) Hold the transaction and send it later. When neither holdSend nor holdSendToJSON is set, the transaction will be sent immediately.',
    }),
  }

  public async run(): Promise<void> {
    const {args, argv, flags} = await this.parse(DevModifyData)

    const CLIConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})

    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ??
        CLIConfig.accountRegistry[flags.fromAccount ?? '']?.privateKey ??
        process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const udtConfig = CLIConfig.UDTRegistry[args.symbol]

    const unpauseHasher = new HasherCkb()
    const unpausePathHex = unpauseHasher.update(Buffer.from('UDTPausable.unpause')).digest().slice(0, 18)

    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0]

    const u832Codec = array(Uint8, 32)
    const u832VecCodec = vector(u832Codec)

    const udtPausableDataCodec = table(
      {
        pause_list: u832VecCodec,
        next_type_script: option(Script),
      },
      ['pause_list', 'next_type_script'],
    )

    const {script: ownerLock} = await signer.getRecommendedAddressObj()

    let lockHashU832Array = []
    for (const lockHash of argv.slice(1)) {
      lockHashU832Array.push(numToBytes(String(lockHash), 32).reverse())
    }
    this.debug(`lockHashU832Array: ${lockHashU832Array}`)
    const lockHashU832ArrayEncoded = encodeU832Array(lockHashU832Array)
    this.debug(`lockHashArrayEncoded: ${lockHashU832ArrayEncoded}`)
    const lockHashU832ArrayEncodedHex = encodeHex(lockHashU832ArrayEncoded)
    const inputTypeScript = await ccc.Script.fromKnownScript(
      client,
      ccc.KnownScript.TypeId,
      '0x4804b04f37f22f77b3cb621e6fbc471330893c98c56868f0d74b91cc996fe0cb',
    )

    const inputTypeIDCell = (await client.findCellsByType(inputTypeScript).next()).value as Cell

    const inputTypeIDCellInput = new ccc.CellInput(inputTypeIDCell.outPoint, BigInt(0))

    // TODO: Placeholder for holdSend and holdSendToJSON.
    const modifyTx = ccc.Transaction.from({
      version: 0,
      cellDeps: [],
      headerDeps: [],
      inputs: [inputTypeIDCellInput],
      outputs: [],
      outputsData: [],
      witnesses: [],
    })

    modifyTx.addOutput(
      {
        lock: ownerLock,
        type: inputTypeScript,
      },
      '0x500000000c0000005000000002000000d19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359ea320a09489791af2e5e1fe84927eda84f71afcbd2c7a65cb419464fe46e75085',
    )

    try {
      await modifyTx.completeInputsByCapacity(signer)
      await modifyTx.completeFeeBy(signer)
      const modifyTxHash = await signer.sendTransaction(modifyTx)
      this.log(`Modified. Tx hash: ${modifyTxHash}`)
    } catch (error) {
      // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
      console.error('Request failed', error)
    }
  }
}
