import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:metadata:name', () => {
  it('runs udt:metadata:name cmd', async () => {
    const {stdout} = await runCommand('udt:metadata:name')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:metadata:name --name oclif', async () => {
    const {stdout} = await runCommand('udt:metadata:name --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
