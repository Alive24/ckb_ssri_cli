import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:metadata:decimals', () => {
  it('runs udt:metadata:decimals cmd', async () => {
    const {stdout} = await runCommand('udt:metadata:decimals')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:metadata:decimals --name oclif', async () => {
    const {stdout} = await runCommand('udt:metadata:decimals --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
