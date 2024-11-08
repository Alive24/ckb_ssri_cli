import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:metadata:symbol', () => {
  it('runs udt:metadata:symbol cmd', async () => {
    const {stdout} = await runCommand('udt:metadata:symbol')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:metadata:symbol --name oclif', async () => {
    const {stdout} = await runCommand('udt:metadata:symbol --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
