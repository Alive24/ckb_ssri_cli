import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:pausable:is_paused', () => {
  it('runs udt:pausable:is_paused cmd', async () => {
    const {stdout} = await runCommand('udt:pausable:is_paused')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:pausable:is_paused --name oclif', async () => {
    const {stdout} = await runCommand('udt:pausable:is_paused --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
