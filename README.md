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

```shell
ckb_ssri_cli udt:pausable:is-paused PUDT 0xd19228c64920eb8c3d79557d8ae59ee7a14b9d7de45ccf8bafacf82c91fc359e
```

```shell
ckb_ssri_cli udt:pausable:enumerate-paused PUDT
```

```shell
// Note: This is a paused address, but minting will override.
ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100
ckb_ssri_cli udt:extended:mint PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100
```

```shell
// Note: This will succeed as transferring as owner.
ckb_ssri_cli udt:transfer PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqgtlcnzzna2tqst7jw78egjpujn7hdxpackjmmdp 100

// Note: This will fail as transferring from paused address.
ckb_ssri_cli udt:transfer --fromAccount=Paused PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100

// Note: This will fail as transferring to paused address.
ckb_ssri_cli udt:transfer --fromAccount=Paused PUDT ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqg7mkruq9gwjdxsgpw8yzmlvzecsqafcysjyrveq 100

```
