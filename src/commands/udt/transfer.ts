import { ccc, Cell, CellDepLike } from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import { getUDTConfig } from '../../libs/config.js'

export default class UdtTransfer extends Command {
  static override args = {
    toAddress: Args.string({description: 'file to read'}),
    toAmount: Args.string({description: 'Amount with decimals. e.g. 1 USDT would be 1 instead of 100000000'}),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    transactionJson: Flags.file({}),
    // flag with a value (-n, --name=VALUE)
  }
  // TODO: Get signer
  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UdtTransfer);

    const client = new ccc.ClientPublicTestnet({ url: process.env.CKB_RPC_URL });
    const signer = new ccc.SignerCkbPrivateKey(
      client,
      process.env.PAUSED_WALLET_PRIVATE_KEY!,
    );
    const toAddress = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqtxe0gs9yvwrsc40znvdc6sg4fehd2mttsngg4t4";
    const toLock = (await ccc.Address.fromString(toAddress, signer.client)).script;
    
    const udtConfig = getUDTConfig();
    const udtTypeScript = new ccc.Script(
      udtConfig.code_hash,
      'type',
      udtConfig.args
    );

    const transferTx = ccc.Transaction.from({
      outputs: [
        {
          lock: toLock,
          type: udtTypeScript,
        },
      ],
      outputsData: [
        ccc.numLeToBytes(50000000, 16)
      ]
    });
    await transferTx.completeInputsByUdt(signer, udtTypeScript);
    await transferTx.completeInputsByCapacity(signer);
    await transferTx.completeFeeBy(signer);

    const findCellDepResult = await client.findCells(udtConfig.cellDepSearchKey).next();
    const cellDepCell: Cell = findCellDepResult.value;
    const cellDepLike: CellDepLike = {
      outPoint: {
        txHash: cellDepCell.outPoint.txHash,
        index: cellDepCell.outPoint.index,
      },
      depType: 'code',
    };

    transferTx.addCellDeps(cellDepLike);
    const transferTxTxHash = await signer.sendTransaction(transferTx);

    console.log(`Minted UDT with transaction hash: ${transferTxTxHash}`);

  }

  // TODO: Traditional transferring for pausable-udt

  // TODO: SSRI transferring for pausable-udt
}
