# ckb_ssri_cli

=================

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
## Usage
<!-- usage -->
Use `./bin/run.js` to try command. `npm exec` cannot parse flags properly.

```sh-session
$ npm install -g ckb_ssri_cli
$ ckb_ssri_cli COMMAND
running command...
$ ckb_ssri_cli (--version)
ckb_ssri_cli/0.0.0 linux-x64 node-v20.9.0
$ ckb_ssri_cli --help [COMMAND]
USAGE
  $ ckb_ssri_cli COMMAND
...
```
<!-- usagestop -->
## Commands
<!-- commands -->

### UDTPausable.is_paused

```shell
ckb_ssri_cli udt:pausable:is-paused PUDT 0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e
```

### UDTPausable.enumerate_paused

```shell
ckb_ssri_cli udt:pausable:enumerate-paused PUDT
```

### UDTExtended.mint

```shell
ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100
// NOTE: This is a paused address, but minting will override.
ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
// NOTE: This won't mint as TestNormal is not owner.
ckb_ssri_cli udt:extended:mint PUDT --fromAccount=TestNormal ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
```

### UDT.transfer

```shell
// Note: This will succeed as transferring as owner overrides despite transferring to paused address.
ckb_ssri_cli udt:transfer PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100

// Note: This will succeed as transferring to non-paused address from normal address.
ckb_ssri_cli udt:transfer --fromAccount=TestNormal PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100

// Note: This will fail as transferring from paused address.
ckb_ssri_cli udt:transfer --fromAccount=Paused PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100

// Note: This will fail as transferring to paused address.
ckb_ssri_cli udt:transfer --fromAccount=TestNormal PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100

```

### UDTMetadata.name
  
```shell
ckb_ssri_cli udt:metadata:name 0x5a68061c57b753c941919e42d74254f878ae2786387e42c1b835980443cb5cc8 0
```
