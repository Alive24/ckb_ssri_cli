import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import { UDTConfig } from '../../../../src/libs/config';
import { sleep } from '@ckb-ccc/core';

describe('config:udt:register', () => {
  const testTestnetPausableUDTConfig: UDTConfig = {
    network: "Testnet",
    code_hash: '0x64e62e0f847240e23bea2801af6c39a62be25b7dce522cef3462624fa260135e',
    args: '0xb5202efa0f2d250af66f0f571e4b8be8b272572663707a052907f8760112fe35',
    symbol: 'TPUDT',
    decimals: 8,
    cellDepSearchKeys: [
      {
        script: {
          // TypeID
          codeHash: '0x00000000000000000000000000000000000000000000000000545950455f4944',
          hashType: 'type',
          args: '0x7cf7de8b8406b55b2a93d3c57273c6ae49607c29ee271408768995ec15374be7',
        },
        scriptType: 'type',
        scriptSearchMode: 'exact',
      },
    ],
  }

  it('runs udt:extended:mint', async () => {
    let runCommandResponse = await runCommand([
      'config:udt:register',
      'TPUDT',
      `${JSON.stringify(testTestnetPausableUDTConfig)}`,
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (runCommandResponse.stdout != '') {
        expect(runCommandResponse.stdout).to.contain('Minted')
        runCommandResponse.stdout = ''
        break
      }
      console.warn(`runCommandResponse: ${runCommandResponse}`)
      console.warn(`stdout: ${runCommandResponse.stdout}, stderr: ${runCommandResponse.stderr}`)
      if (retryCounter > 5) {
        throw Error(`Failed to get response.`)
      }
      retryCounter += 1
    }
    return
  })
})
