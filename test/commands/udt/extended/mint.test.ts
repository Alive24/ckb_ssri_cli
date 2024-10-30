import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:extended:mint', () => {
  it('runs udt:extended:mint cmd', async () => {
    const {stdout} = await runCommand('udt:extended:mint')
    expect(stdout).to.contain('hello world')
  })

  it('runs udt:extended:mint --name oclif', async () => {
    const {stdout} = await runCommand('udt:extended:mint --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
