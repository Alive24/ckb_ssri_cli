import {Args, Command, Flags} from '@oclif/core'
import {getCellDepsFromSearchKeys, getCLIConfig} from '../../../libs/config.js'
import {ccc, Cell, CellOutputLike, fixedPointFrom, HasherCkb, numToBytes} from '@ckb-ccc/core'
import {ClientCollectableSearchKeyLike, cccA} from '@ckb-ccc/core/advanced'
// TODO: Switch to codec in CCC.
import {Byte32, Bytes, BytesVec, Script} from '@ckb-lumos/base/lib/blockchain.js'
import axios from 'axios'
import {blockchain} from '@ckb-lumos/base'
import {encodeHex, encodeU832Array} from '../../../libs/utils.js'
import {array, option, table, vector} from '@ckb-lumos/codec/lib/molecule/layout.js'
import {BIish, Uint8} from '@ckb-lumos/codec/lib/number/uint.js'
import {decodeHex} from '../../../libs/utils.js'

export default class UDTPausablePause extends Command {
  static override args = {
    symbol: Args.string({
      description: 'Symbol of UDT to pause. ',
      required: true,
    }),
    lock_hash: Args.string({description: 'Lock hash in hex. Variable length'}),
  }

  static strict = false

  static override description =
    'Add a lock_hash to pause list. If UDTPausable.enumerate_paused() returns a list of only one UDTPausableData in the vec which means there is no external pausable data cell, a new pausable data cell will be created but manual reference in the contract code is required. NOTE: You cannot use holdSend for more than one pause/pause action in the same transaction, and results of pause/unpause would only take effect after the transaction is confirmed.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    typeID: Flags.string({
      description:
        'Specify one of the pausable data cells; it would verify that the specified cell is part of the linked chain. When not provided, it would automatically point to the last cell on the chain.',
    }),
    newNext: Flags.boolean({
      char: 'n',
      description:
        '(This is done in the CLI) Add the new paused lock hash to a new cell and link it. Would not work if typeID is specified as it might drop data unwittingly. Linking would be skipped when UDTPausable.enumerate_paused() returns a list of only one UDTPausableData in the vec which means there is no external pausable data cell.',
      exclusive: ['typeID'],
    }),
    dropNext: Flags.boolean({
      char: 'd',
      description:
        '(This is done in the CLI) USE WITH CAUTION! Drop the next cell (and therefore all the cells linked to it) in the chain. Depends on typeID.',
      dependsOn: ['typeID'],
    }),
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
    const {args, argv, flags} = await this.parse(UDTPausablePause)

    const CLIConfig = await getCLIConfig(this.config.configDir)
    const client = new ccc.ClientPublicTestnet({url: process.env.CKB_RPC_URL})

    const signer = new ccc.SignerCkbPrivateKey(
      client,
      flags.privateKey ??
        CLIConfig.accountRegistry[flags.fromAccount ?? '']?.privateKey ??
        process.env.MAIN_WALLET_PRIVATE_KEY!,
    )

    const udtConfig = CLIConfig.UDTRegistry[args.symbol]

    const pauseHasher = new HasherCkb()
    const pausePathHex = pauseHasher.update(Buffer.from('UDTPausable.pause')).digest().slice(0, 18)
    const enumeratePausedHasher = new HasherCkb()
    const enumeratePausedPathHex = enumeratePausedHasher
      .update(Buffer.from('UDTPausable.enumerate_paused'))
      .digest()
      .slice(0, 18)

    const codeCellDep = (await getCellDepsFromSearchKeys(client, udtConfig.cellDepSearchKeys))[0]

    let offsetHex = encodeHex(ccc.numLeToBytes(0, 4))
    let limitHex = encodeHex(ccc.numLeToBytes(0, 4))

    const enumeratePathPayload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'run_script_level_code',
      params: [
        codeCellDep.outPoint.txHash,
        Number(codeCellDep.outPoint.index),
        [enumeratePausedPathHex, `0x${offsetHex}`, `0x${limitHex}`],
      ],
    }

    const u832Codec = array(Uint8, 32)
    const u832VecCodec = vector(u832Codec)

    const udtPausableDataCodec = table(
      {
        pause_list: u832VecCodec,
        next_type_script: option(Script),
      },
      ['pause_list', 'next_type_script'],
    )
    let udtPausableDataArray = []
    try {
      const response = await axios.post(process.env.SSRI_SERVER_URL!, enumeratePathPayload, {
        headers: {'Content-Type': 'application/json'},
      })
      const udtPausableDataInBytesVec = BytesVec.unpack(response.data.result)
      for (const udtPausableDataInBytes of udtPausableDataInBytesVec) {
        this.log('udtPausableDataInBytes:', udtPausableDataInBytes)
        const udtPausableData = udtPausableDataCodec.unpack(udtPausableDataInBytes)
        udtPausableDataArray.push(udtPausableData)
        this.log('Parsed udtPausableData:', udtPausableData)
      }
    } catch (error) {
      console.error('Request failed', error)
    }
    if (udtPausableDataArray.length === 0) {
      throw new Error('Failed to parse udtPausableData')
    }

    this.debug(`udtPausableDataArray: ${udtPausableDataArray}`)

    const {script: ownerLock} = await signer.getRecommendedAddressObj()

    let lockHashU832Array = []
    for (const lockHash of argv.slice(1)) {
      lockHashU832Array.push(numToBytes(String(lockHash), 32).reverse())
    }
    this.debug(`lockHashU832Array: ${lockHashU832Array}`)
    const lockHashU832ArrayEncoded = encodeU832Array(lockHashU832Array)
    this.debug(`lockHashArrayEncoded: ${lockHashU832ArrayEncoded}`)
    const lockHashU832ArrayEncodedHex = encodeHex(lockHashU832ArrayEncoded)

    // TODO: Placeholder for holdSend and holdSendToJSON.
    const heldTx = ccc.Transaction.from({
      version: 0,
      cellDeps: [codeCellDep],
      headerDeps: [],
      inputs: [],
      outputs: [
        {
          lock: ownerLock,
        },
      ],
      outputsData: [],
      witnesses: [],
    })

    const heldTxEncodedHex = encodeHex(heldTx.toBytes())

    let targetPausableDataCell: Cell | undefined
    let payload
    if (flags.typeID !== undefined) {
      // Case 1: Point to one of the node on the chain.
      const searchKey: ClientCollectableSearchKeyLike = {
        script: {
          // TypeID
          codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
          hashType: 'type',
          args: flags.typeID,
        },
        scriptType: 'type',
        scriptSearchMode: 'exact',
      }
      targetPausableDataCell = (await client.findCells(searchKey).next()).value as Cell | undefined
      if (targetPausableDataCell === undefined) {
        throw new Error('No cell found.')
      }
      let matchingPausableData = udtPausableDataArray.find((udtPausableData) => {
        if (
          udtPausableData.next_type_script !== undefined &&
          targetPausableDataCell !== undefined &&
          targetPausableDataCell.cellOutput.type !== undefined
        ) {
          let next_type_script = new ccc.Script(
            udtPausableData.next_type_script.codeHash as `0x${string}`,
            udtPausableData.next_type_script.hashType,
            udtPausableData.next_type_script.args as `0x${string}`,
          )
          return next_type_script.hash() === targetPausableDataCell.cellOutput.type?.hash()
        } else {
          return false
        }
      })
      if (matchingPausableData === undefined) {
        throw new Error('No cell with matching pausable data found with the specified Type ID.')
      }
    }

    if (targetPausableDataCell !== undefined) {
      payload = {
        id: 2,
        jsonrpc: '2.0',
        method: 'run_script_level_cell',
        params: [
          codeCellDep.outPoint.txHash,
          Number(codeCellDep.outPoint.index),
          [pausePathHex, `0x${heldTxEncodedHex}`, `0x${lockHashU832ArrayEncodedHex}`],
          {
            cell_output: {
              capacity: ccc.numToHex(0),
              lock: {
                code_hash: targetPausableDataCell.cellOutput.lock.codeHash,
                args: targetPausableDataCell.cellOutput.lock.args,
                hash_type: targetPausableDataCell.cellOutput.lock.hashType,
              },
              type: {
                code_hash: targetPausableDataCell.cellOutput.type?.codeHash,
                args: targetPausableDataCell.cellOutput.type?.args,
                hash_type: targetPausableDataCell.cellOutput.type?.hashType,
              },
            },
            hex_data: targetPausableDataCell.outputData,
          },
        ],
      }
    } else {
      // Use a dummy cell with dummy_typeid_script and empty hex_data. It would automatically redirect to the last cell on the chain.
      let dummy_typeid_script = await ccc.Script.fromKnownScript(client, ccc.KnownScript.TypeId, '0x')
      payload = {
        id: 2,
        jsonrpc: '2.0',
        method: 'run_script_level_cell',
        params: [
          codeCellDep.outPoint.txHash,
          Number(codeCellDep.outPoint.index),
          [pausePathHex, `0x${heldTxEncodedHex}`, `0x${lockHashU832ArrayEncodedHex}`],
          {
            cell_output: {
              capacity: `0x0`,
              lock: {
                code_hash: ownerLock.codeHash,
                args: ownerLock.args,
                hash_type: ownerLock.hashType,
              },
              type: {
                code_hash: dummy_typeid_script.codeHash,
                args: dummy_typeid_script.args,
                hash_type: dummy_typeid_script.hashType,
              },
            },
            hex_data: `0x`,
          },
        ],
      }
    }

    try {
      const response = await axios.post(process.env.SSRI_SERVER_URL!, payload, {
        headers: {'Content-Type': 'application/json'},
      })
      const pauseTx = blockchain.Transaction.unpack(response.data.result)
      const cccPauseTx = ccc.Transaction.from(pauseTx)
      cccPauseTx.outputs.at(-1)!.capacity = fixedPointFrom(
        cccPauseTx.outputs.at(-1)!.occupiedSize + cccPauseTx.outputsData.at(-1)!.length,
      )
      await cccPauseTx.completeInputsByCapacity(signer)
      if (cccPauseTx.outputs.at(-1)?.type?.args === '0x') {
        this.log(
          '⚠️WARNING: No external pause list cell found. A new pausable data cell is created but manual reference in the contract code is required.',
        )
        const newTypeIDTypescript = await ccc.Script.fromKnownScript(
          client,
          ccc.KnownScript.TypeId,
          ccc.hashTypeId(cccPauseTx.inputs[0], cccPauseTx.outputs.length - 1),
        )
        cccPauseTx.outputs.at(-1)!.type = newTypeIDTypescript
        // TODO: This is not optimal capacity (which is 173 CKB).
        cccPauseTx.outputs.at(-1)!.capacity = fixedPointFrom(
          cccPauseTx.outputs.at(-1)!.occupiedSize + cccPauseTx.outputsData.at(-1)!.length,
        )
      } else {
        if (flags.newNext && targetPausableDataCell !== undefined) {
          // NOTE: Adding newNext must be done offchain as it relies on input.
          let currentPausableData = udtPausableDataArray.at(-1)!
          currentPausableData.pause_list.filter((lockHash) => {
            return !lockHashU832Array.includes(Bytes.pack(lockHash))
          })
          const nextTypeIDTypescript = await ccc.Script.fromKnownScript(
            client,
            ccc.KnownScript.TypeId,
            ccc.hashTypeId(cccPauseTx.inputs[0], cccPauseTx.outputs.length + 1),
          )
          currentPausableData.next_type_script = nextTypeIDTypescript
          cccPauseTx.outputs.at(-1)!.type = nextTypeIDTypescript
          cccPauseTx.addOutput(
            {
              type: nextTypeIDTypescript,
              lock: ownerLock,
            },
            udtPausableDataCodec.pack({
              pause_list: lockHashU832Array.map((lockHash) => [...new Uint8Array([...lockHash])]),
              next_type_script: undefined,
            }),
          )
        }
      }
      await cccPauseTx.completeFeeBy(signer)
      const pauseTxHash = await signer.sendTransaction(cccPauseTx)
      this.log(`New Paused Lock Hashes added to ${args.symbol}. Tx hash: ${pauseTxHash}`)
    } catch (error) {
      // ISSUE: [Prettify responses from SSRI calls #21](https://github.com/Alive24/ckb_ssri_cli/issues/21)
      console.error('Request failed', error)
    }
  }
}
