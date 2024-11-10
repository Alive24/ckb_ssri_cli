import { sleep } from '@ckb-ccc/core'
import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:transfer', () => {
  it('runs udt:transfer as owner', async () => {
    let {stdout} = await runCommand([
      'udt:transfer',
      'PUDT',
      'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp',
      '100',
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('Transferred')
        stdout = ''
        break
      }
      console.warn(`stdout: ${stdout}`)
      if (retryCounter > 5) {
        throw Error(`Failed to get response.`)
      }
      retryCounter += 1
    }
    return
  }),
  it('runs udt:transfer to normal address from normal address', async () => {
    let {stdout} = await runCommand([
      'udt:transfer',
      '--fromAccount=TestNormal',
      'PUDT',
      'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq',
      '100',
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('Transferred')
        stdout = ''
        break
      }
      console.warn(`stdout: ${stdout}`)
      if (retryCounter > 5) {
        throw Error(`Failed to get response.`)
      }
      retryCounter += 1
    }
    return
  }),
  it('runs udt:transfer from paused address.', async () => {
    let {stderr} = await runCommand([
      'udt:transfer',
      '--fromAccount=Paused',
      'PUDT',
      'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq',
      '100',
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stderr != '') {
        // TODO: Parse the error
        expect(stderr).to.contain('46')
        stderr = ''
        break
      }
      console.warn(`stderr: ${stderr}`)
      if (retryCounter > 5) {
        throw Error(`Failed to get response.`)
      }
      retryCounter += 1
    }
    return
  }),
  it('runs udt:transfer to to paused address', async () => {
    let {stderr} = await runCommand([
      'udt:transfer',
      '--fromAccount=TestNormal',
      'PUDT',
      'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp',
      '100',
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stderr != '') {
        // TODO: Parse the error
        expect(stderr).to.contain('46')
        stderr = ''
        break
      }
      console.warn(`stderr: ${stderr}`)
      if (retryCounter > 5) {
        throw Error(`Failed to get response.`)
      }
      retryCounter += 1
    }
    return
  })
})
