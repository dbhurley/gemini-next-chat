import * as arxiv from './arxiv'
import * as reader from './reader'
import * as unsplash from './unsplash'
import * as time from './time'
import * as weather from './weather'
import * as search from './search'
import * as zion from './zion'

export const officialPlugins: Record<string, OpenAPIDocument> = {
  OfficialReader: reader.openapi,
  OfficialArxiv: arxiv.openapi,
  OfficialUnsplash: unsplash.openapi,
  OfficialTime: time.openapi,
  OfficialWeather: weather.openapi,
  OfficialSearch: search.openapi,
  OfficialZion: zion.openapi
}

export const OFFICAL_PLUGINS = {
  SEARCH: 'OfficialSearch',
  READER: 'OfficialReader',
  WEATHER: 'OfficialWeather',
  TIME: 'OfficialTime',
  UNSPLASH: 'OfficialUnsplash',
  ARXIV: 'OfficialArxiv',
  ZION: 'OfficialZion'
}

export function pluginHandle(name: string, options: any) {
  switch (name) {
    case 'OfficialReader':
      return reader.handle(options)
    case 'OfficialArxiv':
      return arxiv.handle(options)
    case 'OfficialUnsplash':
      return unsplash.handle(options)
    case 'OfficialTime':
      return time.handle(options)
    case 'OfficialWeather':
      return weather.handle(options)
    case 'OfficialSearch':
      return search.handle(options)
    case 'OfficialZion':
      return zion.handle(options)
    default:
      throw new Error('Unable to find plugin')
  }
}
