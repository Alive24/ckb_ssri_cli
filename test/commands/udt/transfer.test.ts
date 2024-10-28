import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:transfer', () => {
  it('runs udt:transfer cmd', async () => {
    const {stdout} = await runCommand('udt:transfer')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:transfer --name oclif', async () => {
    const {stdout} = await runCommand('udt:transfer --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
