import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:balance', () => {
  it('runs udt:balance cmd', async () => {
    const {stdout} = await runCommand('udt:balance')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:balance --name oclif', async () => {
    const {stdout} = await runCommand('udt:balance --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
