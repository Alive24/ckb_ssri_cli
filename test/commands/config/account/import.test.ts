import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('config:account:import', () => {
  it('runs config:account:import cmd', async () => {
    const {stdout} = await runCommand('config:account:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs config:account:import --name oclif', async () => {
    const {stdout} = await runCommand('config:account:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
