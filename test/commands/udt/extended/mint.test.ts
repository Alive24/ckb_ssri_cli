import {sleep} from '@ckb-ccc/core'
import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('udt:extended:mint', () => {
  it('runs udt:extended:mint', async () => {
    let {stdout} = await runCommand([
      'udt:extended:mint',
      'PUDT',
      'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp',
      '100',
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stdout != '') {
        expect(stdout).to.contain('Minted')
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
  })

  it('runs udt:extended:mint --fromAccount=TestNormal', async () => {
    let {stderr} = await runCommand([
      'udt:extended:mint',
      '--fromAccount=TestNormal',
      'PUDT',
      'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp',
      '100',
    ])
    let retryCounter = 0
    while (true) {
      await sleep(5000)
      if (stderr != '') {
        expect(stderr).to.contain('39')
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
