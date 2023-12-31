import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import stream, { Stream } from 'stream'
import merge from 'lodash.merge'
import UserAgent from 'user-agents'
import { DeepPartial, Options } from './types'

export function withImageProxy(passedOptions?: DeepPartial<Options>) {
  const defaultOptions: Options = {
    whitelistedPatterns: [],
    fallbackUrl: '',
    messages: {
      wrongFormat: 'Image url not provided or has wrong format',
      notWhitelisted: 'Provided image url is not whitelisted',
      imageFetchError: "Couldn't fetch the image",
    },
  }

  const options: Options = merge(defaultOptions, passedOptions)

  return async function (req: NextApiRequest, res: NextApiResponse) {
    const imageUrl = req.query.imageUrl as string;
    const token = req.query.token as string;
    const typeToken = req.query.typeToken as string;

    if (!imageUrl || (imageUrl && Array.isArray(imageUrl))) {
      res.status(400).send({ message: options.messages.wrongFormat })
      return
    }

    const isAllowed = isUrlWhitelisted(imageUrl, options.whitelistedPatterns)

    if (!isAllowed) {
      res.status(422).send({ message: options.messages.notWhitelisted })
      return
    }

    const imageBlob = await fetchImageBlob(imageUrl, `${typeToken} ${token}`)

    if (!imageBlob) {
      handleFallback(res, options)
      return
    }

    pipeImage(res, imageBlob, options)
  }
}

function pipeImage(res: NextApiResponse, imageBlob: NodeJS.ReadableStream, options: Options) {
  const passThrough = new Stream.PassThrough()
  stream.pipeline(imageBlob, passThrough, (err) => {
    if (err) {
      console.log(err)
      handleFallback(res, options)
      return
    }
  })
  passThrough.pipe(res)
}

function handleFallback(res: NextApiResponse, options: Options) {
  if (options.fallbackUrl.trim()) {
    res.redirect(options.fallbackUrl)
  } else {
    res.status(422).send({ message: options.messages.imageFetchError })
  }
}

async function fetchImageBlob(url: string, authorization: string) {
  return fetch(url, {
    headers: { 'user-agent': new UserAgent().toString(), 'Authorization': authorization },
  })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}`)
        }
        return res.body
      })
      .catch((error: any) => console.error(error))
}

function isUrlWhitelisted(url: string, whitelistedPatterns: Options['whitelistedPatterns']) {
  return whitelistedPatterns.some((singleHost) => {
    return url.match(singleHost)
  })
}
