# Changelog

## [3.0.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v3.0.0...v3.0.1) (2025-05-30)

### Bug Fixes

* incorrect type for unwrap function ([5ceda1b](https://github.com/DouglasNeuroInformatics/libjs/commit/5ceda1bc76ae1d901ed916eb2e3c8926708b1285))

## [3.0.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.9.0...v3.0.0) (2025-05-30)

### ⚠ BREAKING CHANGES

* All Zod helpers now use v4
* use unwrap utility rather than importing neverthrow from libjs

### Features

* add isZodTypeLike ([e6540a5](https://github.com/DouglasNeuroInformatics/libjs/commit/e6540a52fccb2304238c4bf81dd495c461755eeb))
* add neverthrow module ([4a66cbb](https://github.com/DouglasNeuroInformatics/libjs/commit/4a66cbb13319eab60cb5e8b386c44e70cc0c6d6d))

### Code Refactoring

* finalize conversion to Zod v4 ([c29326f](https://github.com/DouglasNeuroInformatics/libjs/commit/c29326fb41a23c8bfb10e18343bb2013b9002068))
* remove vendored neverthrow ([05821c4](https://github.com/DouglasNeuroInformatics/libjs/commit/05821c41daa0d5b41e2927fbf39b49c609fcb012))

## [2.9.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.8.1...v2.9.0) (2025-04-19)

### Features

* add formatByteSize ([069f71f](https://github.com/DouglasNeuroInformatics/libjs/commit/069f71f66c6b61552c649b0ffd09f6af2be166dc))

## [2.8.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.8.0...v2.8.1) (2025-04-06)

### Bug Fixes

* add includeStack option to errorToJSON ([48af62c](https://github.com/DouglasNeuroInformatics/libjs/commit/48af62c9ac984fe6aea979ca103f4fc53ff91e9e))

## [2.8.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.7.0...v2.8.0) (2025-04-06)

### Features

* add errorToJSON function ([d30564d](https://github.com/DouglasNeuroInformatics/libjs/commit/d30564d396fd9bee0b689b96ab4d4c5344904b42))
* allow calling parseStack with string ([ec03ec3](https://github.com/DouglasNeuroInformatics/libjs/commit/ec03ec39fde75bfb27f23096cbaa614cc6c9f3ae))

## [2.7.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.6.0...v2.7.0) (2025-03-31)

### Features

* add vendored neverthrow ([b929098](https://github.com/DouglasNeuroInformatics/libjs/commit/b92909870d8bb081a119db1bc0f5e611033c1a51))

## [2.6.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.5.0...v2.6.0) (2025-03-29)

### Features

* add parseStack function ([5b01a1c](https://github.com/DouglasNeuroInformatics/libjs/commit/5b01a1cf89ca84ce9d5ed3125b4abcc2dc628c61))

## [2.5.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.4.0...v2.5.0) (2025-03-29)

### Features

* add asyncResultify ([a4c2d79](https://github.com/DouglasNeuroInformatics/libjs/commit/a4c2d790388c5adcc378792c768e0c4a727038af))
* add ExceptionLike interface ([ac93dc1](https://github.com/DouglasNeuroInformatics/libjs/commit/ac93dc1283a57a619fd9f655d1c9f1b2d02a66b9))
* add http module ([4ba8e4c](https://github.com/DouglasNeuroInformatics/libjs/commit/4ba8e4c1b257ca6e9d270ce80624bc714123289b))

## [2.4.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.3.0...v2.4.0) (2025-03-16)

### Features

* add FallbackIfNever type ([d29628b](https://github.com/DouglasNeuroInformatics/libjs/commit/d29628bc572e85e06e57b27a504400020c66e9c1))

## [2.3.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.2.2...v2.3.0) (2025-02-26)

### Features

* add safeParse ([6510312](https://github.com/DouglasNeuroInformatics/libjs/commit/65103128414e3106c0a4a841e047213b2e2a488b))
* add ValidationException ([84fd18b](https://github.com/DouglasNeuroInformatics/libjs/commit/84fd18b7c342d807b6dbbf5e92f7650a0d90fa55))

## [2.2.2](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.2.1...v2.2.2) (2025-02-26)

### Bug Fixes

* add RuntimeException ([dcbe03b](https://github.com/DouglasNeuroInformatics/libjs/commit/dcbe03babee46249dd88db62ffd536d1e911035a))

## [2.2.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.2.0...v2.2.1) (2025-02-26)

### Bug Fixes

* export more exception types ([dcab592](https://github.com/DouglasNeuroInformatics/libjs/commit/dcab592a2e893bf84f6584633ea6f2783b9e41ab))

## [2.2.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.1.0...v2.2.0) (2025-02-26)

### Features

* add indentLines function ([ae617db](https://github.com/DouglasNeuroInformatics/libjs/commit/ae617db5e3a84e35ae2d22f8cf92b7f697562479))
* add toString method to exception ([af33eb6](https://github.com/DouglasNeuroInformatics/libjs/commit/af33eb6ffd654ce2e18b2fe8ddf16f4ec919aeb0))
* finish implementing toString on exception ([a21d015](https://github.com/DouglasNeuroInformatics/libjs/commit/a21d01594c56a1d4f7f5bfd79b0ce921591e974b))
* implement toString method on exception ([61c4d6b](https://github.com/DouglasNeuroInformatics/libjs/commit/61c4d6b5ec9138543515623d939899631865f82a))

## [2.1.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.0.1...v2.1.0) (2025-02-25)

### Features

* add new toAsyncErr method on exceptions ([f130740](https://github.com/DouglasNeuroInformatics/libjs/commit/f1307407892c361bfe73b617d8f3ab9e31abd76e))

## [2.0.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v2.0.0...v2.0.1) (2025-02-25)

### Bug Fixes

* set neverthrow and zod to be peer deps ([0183162](https://github.com/DouglasNeuroInformatics/libjs/commit/0183162980cfcad35176499dd03b46a51de1ecde))

## [2.0.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.5.1...v2.0.0) (2025-02-25)

### ⚠ BREAKING CHANGES

* return result from parseDuration

### Features

* add asErr static method to Exception ([c693f80](https://github.com/DouglasNeuroInformatics/libjs/commit/c693f805707c7017985d6e45c53855797368c631))
* add extend method to ExceptionBuilder ([8b9e82e](https://github.com/DouglasNeuroInformatics/libjs/commit/8b9e82e10e837e8c43cf95b9d2444ab25522b6df))
* add infer method to exception ([fd407c7](https://github.com/DouglasNeuroInformatics/libjs/commit/fd407c71ea4d73dc7f83c7653d185ca7fb6c4af7))
* add never type helpers ([c41c4f2](https://github.com/DouglasNeuroInformatics/libjs/commit/c41c4f2bf93408c9d61934741d67d725cc6bd144))
* add new forNonPositive static method ([ee3bef2](https://github.com/DouglasNeuroInformatics/libjs/commit/ee3bef227c4c1b3872e7998bcc7cd7339903b97d))
* add objectify function ([eda0085](https://github.com/DouglasNeuroInformatics/libjs/commit/eda0085ad96506e2b938b64dbd8c2215e16ae52b))
* add static method createCoreException ([ba01022](https://github.com/DouglasNeuroInformatics/libjs/commit/ba010227a0cb72d3f3645e0903e2b2376689c173))
* add ToAbstractConstructor ([a5ce7a0](https://github.com/DouglasNeuroInformatics/libjs/commit/a5ce7a0f9773b338db4bf8e71d3c7e3d8f973a44))
* add toErr on exception ([fa28e13](https://github.com/DouglasNeuroInformatics/libjs/commit/fa28e13cd3dd5b97ca6b9ab61b2a8c47fcbeb76d))
* add ValueError ([5d1d1ea](https://github.com/DouglasNeuroInformatics/libjs/commit/5d1d1eaea05177a608794a3e903f688715994ac4))
* allow function for message in error params ([8891cc8](https://github.com/DouglasNeuroInformatics/libjs/commit/8891cc871f8517f46ea4a0e2d02411768219bbec))
* finish OutOfRangeError ([a6a8ef6](https://github.com/DouglasNeuroInformatics/libjs/commit/a6a8ef6017ed25ec7e48df024fe5876bc8ab19b4))

### Bug Fixes

* linting issues ([0a714d8](https://github.com/DouglasNeuroInformatics/libjs/commit/0a714d80151deadf81ac5d6ed6f28134abd09cce))

### Code Refactoring

* return result from parseDuration ([71ba2cc](https://github.com/DouglasNeuroInformatics/libjs/commit/71ba2cc7ec21367ed833cc0fd48a0cb2b803c6ce))

## [1.5.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.5.0...v1.5.1) (2025-02-24)

### Bug Fixes

* set params to private in ExceptionBuilder ([8595ec9](https://github.com/DouglasNeuroInformatics/libjs/commit/8595ec9d074d49b386efe5b835de719206822422))

## [1.5.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.4.0...v1.5.0) (2025-02-23)

### Features

* add exception ([dba2721](https://github.com/DouglasNeuroInformatics/libjs/commit/dba27210bde1a234b5355930e6ff8ba209a53d38))

## [1.4.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.3.2...v1.4.0) (2025-02-14)

### Features

* add $Uint8ArrayLike ([4619f05](https://github.com/DouglasNeuroInformatics/libjs/commit/4619f052e1e685a4397a710824b899f0ac7b64df))
* add $UrlLike ([b1cf915](https://github.com/DouglasNeuroInformatics/libjs/commit/b1cf915867d2889b4f2d52000f4f5c4cac7e3969))

## [1.3.2](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.3.1...v1.3.2) (2025-02-14)

### Bug Fixes

* add explicit types to schemas ([20ec8a2](https://github.com/DouglasNeuroInformatics/libjs/commit/20ec8a214d282e9231d116e70caabf08cedfd729))

## [1.3.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.3.0...v1.3.1) (2025-02-14)

### Bug Fixes

* replace schema factories with pipe ([4ad89b4](https://github.com/DouglasNeuroInformatics/libjs/commit/4ad89b4c5562d768e43f629a5ae803e2f703d00a))

## [1.3.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.2.1...v1.3.0) (2025-02-13)

### Features

* add $BooleanLike ([de29ac7](https://github.com/DouglasNeuroInformatics/libjs/commit/de29ac7e9d9a150dc39f8d6ddf643c6dc3cc9cab))
* add filterObject ([2984eb8](https://github.com/DouglasNeuroInformatics/libjs/commit/2984eb8641506c33bd8c20397f0e99e9b147e057))
* add zod module ([e64decf](https://github.com/DouglasNeuroInformatics/libjs/commit/e64decf1ff6ba9e3e3398f95bb8e068b44af7608))

## [1.2.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.2.0...v1.2.1) (2025-01-29)


### Bug Fixes

* remove typescript as peer dependency ([1a66dbe](https://github.com/DouglasNeuroInformatics/libjs/commit/1a66dbe87b4f9ff8eca914ea841b7dce1cb50766))

## [1.2.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.1.0...v1.2.0) (2025-01-01)


### Features

* add toLocalISOString ([36366cd](https://github.com/DouglasNeuroInformatics/libjs/commit/36366cd8b46a8ab28cf8a73d88d6fed28f967d59))

## [1.1.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.0.2...v1.1.0) (2024-12-23)


### Features

* add isAllUndefined ([6934017](https://github.com/DouglasNeuroInformatics/libjs/commit/6934017cf3dcda4c03ee1305c8c01e93ea01909b))

## [1.0.2](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.0.1...v1.0.2) (2024-10-22)


### Bug Fixes

* remove console log ([2091474](https://github.com/DouglasNeuroInformatics/libjs/commit/2091474fa4dee6c6e8398723f8f32ba7f3a53662))

## [1.0.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v1.0.0...v1.0.1) (2024-10-22)


### Bug Fixes

* issue serializing date ([ac97700](https://github.com/DouglasNeuroInformatics/libjs/commit/ac97700923ff138384e26aed1b71cb5c03d2015a))

## [1.0.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.8.0...v1.0.0) (2024-10-22)


### ⚠ BREAKING CHANGES

* serialize date

### Features

* serialize date ([48441f7](https://github.com/DouglasNeuroInformatics/libjs/commit/48441f7264b7d1937553da8880d43c2a96df4e71))

## [0.8.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.7.1...v0.8.0) (2024-10-01)


### Features

* add parseDuration and TIME_MAP ([020bc35](https://github.com/DouglasNeuroInformatics/libjs/commit/020bc352a3293cd26d0a1eed3693f44c72b5b47a))

## [0.7.1](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.7.0...v0.7.1) (2024-09-17)


### Bug Fixes

* remove console log statement ([c12fbd2](https://github.com/DouglasNeuroInformatics/libjs/commit/c12fbd29aba4d1b10f237422a7194f42300c7033))

## [0.7.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.6.0...v0.7.0) (2024-09-10)


### Features

* add format function ([143b149](https://github.com/DouglasNeuroInformatics/libjs/commit/143b149732c37f030cda9a9401d0aa4ac7572c86))

## [0.6.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.5.0...v0.6.0) (2024-08-16)


### Features

* add json utils ([dd953dc](https://github.com/DouglasNeuroInformatics/libjs/commit/dd953dc324f8aa88d2b5587f0dbe304b91584290))

## [0.5.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.4.0...v0.5.0) (2024-08-15)


### Features

* add number utils ([88e8f90](https://github.com/DouglasNeuroInformatics/libjs/commit/88e8f9008e52bb84d5882b300b042fcc7260ede8))

## [0.4.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.3.0...v0.4.0) (2024-07-19)

### Features

- add readonlyType option to deepFreeze ([7929ff5](https://github.com/DouglasNeuroInformatics/libjs/commit/7929ff5e1fa8c917d63240d24ed832b2b1167eb5))

## [0.3.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.2.0...v0.3.0) (2024-03-25)

### Features

- add HasNestedKey utility type ([2d7d6ee](https://github.com/DouglasNeuroInformatics/libjs/commit/2d7d6eee947dc3e8c384f77d6eb6a123b32b4131))

## [0.2.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.1.0...v0.2.0) (2024-03-22)

### Features

- add isUnique and hasDuplicates ([5a8071e](https://github.com/DouglasNeuroInformatics/libjs/commit/5a8071e5479c6e2c4b30ebf8e74d99af332f0319))

## [0.1.0](https://github.com/DouglasNeuroInformatics/libjs/compare/v0.0.2...v0.1.0) (2024-03-21)

### Features

- add isObject, isObjectLike, and isPlainObject ([8321ae5](https://github.com/DouglasNeuroInformatics/libjs/commit/8321ae51b4632121ba9ca43979c3bbed59cd4492))
