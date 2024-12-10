import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:pausable:pause', () => {
  it('runs udt:pausable:pause cmd', async () => {
    const {stdout} = await runCommand('udt:pausable:pause')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:pausable:pause --name oclif', async () => {
    const {stdout} = await runCommand('udt:pausable:pause --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
