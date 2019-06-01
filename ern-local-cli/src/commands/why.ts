import { getActiveCauldron } from 'ern-cauldron-api'
import {
  AppVersionDescriptor,
  PackagePath,
  dependencyLookup,
  log,
} from 'ern-core'
import { epilog, tryCatchWrap } from '../lib'
import { Argv } from 'yargs'

export const command = 'why <dependency> <completeNapDescriptor>'
// COMMAND DEPRECATED IN 0.31.0. TO BE REMOVED IN 0.35.0.
export const desc =
  'Why is a given native dependency included in a native application version ? [DEPRECATED]'

export const builder = (argv: Argv) => {
  return argv.epilog(epilog(exports))
}

export const commandHandler = async ({
  completeNapDescriptor,
  dependency,
}: {
  completeNapDescriptor: string
  dependency: string
}) => {
  log.warn(
    'This command has been deprecated in 0.31.0. Use `ern cauldry why` instead.'
  )
  const napDescriptor = AppVersionDescriptor.fromString(completeNapDescriptor)
  const cauldron = await getActiveCauldron()
  const miniApps = await cauldron.getContainerMiniApps(napDescriptor)
  log.info(`This might take a while. The more MiniApps, the longer.`)
  const result = await dependencyLookup.getMiniAppsUsingNativeDependency(
    miniApps,
    PackagePath.fromString(dependency)
  )
  if (!result || result.length === 0) {
    log.info(`${dependency} dependency is not directly used by any MiniApps`)
  } else {
    log.info(`The following MiniApp(s) are using ${dependency} dependency :`)
    for (const miniApp of result) {
      log.info(`=> ${miniApp.name}`)
    }
  }
}

export const handler = tryCatchWrap(commandHandler)
