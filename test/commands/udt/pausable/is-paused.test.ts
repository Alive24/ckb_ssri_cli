import { sleep } from '@ckb-ccc/core'
import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:pausable:is-paused', () => {
  it('runs udt:pausable:is-paused', async () => {
    let {stdout} = await runCommand([
      'udt:pausable:is-paused',
      'PUDT',
      '0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e',
    ])
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('0x01')
        stdout = ''
        break
      }
    }
  })

  it('runs udt:pausable:is-paused', async () => {
    let {stdout} = await runCommand([
      'udt:pausable:is-paused',
      'PUDT',
      '0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc3591',
    ])
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('0x00')
        stdout = ''
        break
      }
    }
  })
})
