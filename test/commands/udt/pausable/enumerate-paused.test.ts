import {sleep} from '@ckb-ccc/core'
import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:pausable:enumerate-paused', () => {
  it('runs udt:pausable:enumerate-paused', async () => {
    let {stdout} = await runCommand(['udt:pausable:enumerate-paused', 'PUDT'])
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('d19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e')
        stdout = ''
        break
      }
    }
  })
})
