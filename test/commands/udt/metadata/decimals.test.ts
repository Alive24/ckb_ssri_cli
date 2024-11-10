import { sleep } from '@ckb-ccc/core'
import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:metadata:decimals', () => {
  it('runs udt:metadata:decimals cmd', async () => {
    let {stdout} = await runCommand([
      'udt:metadata:decimals',
      '0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8',
      '0'
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('0x08')
        stdout = ''
        break
      }
      console.warn(`stdout: ${stdout}`)
      if (retryCounter > 5) {
        throw Error(`Failed to get response.`)
      }
      retryCounter += 1
    }
    return
  })
})
