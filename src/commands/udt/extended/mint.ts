import { ccc, Cell, CellDep, CellDepLike } from '@ckb-ccc/core'
import {Args, Command, Flags} from '@oclif/core'
import { getUDTConfig } from '../../../libs/config.js'
import 'dotenv/config'

export default class UdtExtendedMint extends Command {
  static override args = {
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(UdtExtendedMint)

    const client = new ccc.ClientPublicTestnet({ url: process.env.CKB_RPC_URL });
    const signer = new ccc.SignerCkbPrivateKey(
      client,
      process.env.MAIN_WALLET_PRIVATE_KEY!,
    );

    const recommendedActorAddress = await signer.getRecommendedAddress();
    const { script: ownerLock } = await signer.getRecommendedAddressObj();

    const toAddress = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp";
    const toLock = (await ccc.Address.fromString(toAddress, signer.client)).script;

    const udtConfig = getUDTConfig();
    const udtTypeScript = new ccc.Script(
      udtConfig.code_hash,
      'type',
      udtConfig.args
    );

    const mintTx = ccc.Transaction.from({
      outputs: [
        {
          lock: toLock,
          type: udtTypeScript,
        },
      ],
      outputsData: [
        ccc.numLeToBytes(100000000, 16)
      ]
    });

    await mintTx.completeInputsByCapacity(signer);
    await mintTx.completeFeeBy(signer);

    console.log(mintTx.inputs[0]);

    const findCellDepResult = await client.findCells(udtConfig.cellDepSearchKey).next();
    const cellDepCell: Cell = findCellDepResult.value;
    const cellDepLike: CellDepLike = {
      outPoint: {
        txHash: cellDepCell.outPoint.txHash,
        index: cellDepCell.outPoint.index,
      },
      depType: 'code',
    };

    mintTx.addCellDeps(cellDepLike);
    const mintTxHash = await signer.sendTransaction(mintTx);

    console.log(`Minted UDT with transaction hash: ${mintTxHash}`);
  }
}
