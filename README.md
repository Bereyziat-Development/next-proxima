<div align="center">
  <h1>Next Proxima</h1>
  <p>The name is basically stands for image proxy for Next.js. Makes it possible to use dynamic domains in next/image component.</p> 
  <br />
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/@b-dev/next-proxima"><img alt="npm version badge" src="https://img.shields.io/npm/v/@blazity/next-image-proxy"></a>
  <img alt="license badge" src="https://img.shields.io/npm/l/@b-dev/next-proxima">
</div>

<br />

## ❔ Motivation

This library enables the usage of `next/image` with dynamic domains. When working with external providers such as Facebook, Instagram, Etsy, Medium, and others, images often originate from dynamic subdomains. For example, you might retrieve the first image from `scontent-akl1-1.cdninstagram.com` and the second image from `scontent-akl3-1.cdninstagram.com`. While temporarily adding these subdomains to the Next.js configuration might work, it lacks reliability as the subdomains can change unpredictably. Unfortunately, Next.js doesn't currently support regex patterns in the configuration file to handle dynamic domains.

This library provides an additional feature where it can also be used to bypass authenticated images from the server or backend by passing a token. This allows you to fetch and display images that require authorization or authentication in your Next.js application.

To keep up with the ongoing discussion regarding Next.js support for this feature, you can refer to this [Discussion](https://github.com/vercel/next.js/discussions/18429) and this [Pull Request](https://github.com/vercel/next.js/pull/27345).

Please consider the following aspects:

- Insufficiently strict regex patterns can create security vulnerabilities, so it's important to ensure your patterns are sufficiently strict.
- As this library acts as a proxy, there may be a marginal increase in bandwidth costs. However, this increase should be minimal unless you're dealing with a high-volume project with millions of requests per month.

⚠️ **Limitations:**

Please be aware of the following limitations when using this library:

- Compatibility with Netlify may vary. Test thoroughly before deploying to a Netlify environment.
- Compatibility with serverless-next.js may be limited. Evaluate the compatibility with your specific serverless setup.

Feel free to modify the content further to align with your preferences and project requirements.

## 🧰 Installation

```
$ npm i --save @b-dev/next-proxima

# or

$ yarn add @b-dev/next-proxima
```

## 💻 Use

It is really simple to setup, you just need to add a new API route that exports one function. The name of the endpoint is up to you.

```tsx
// pages/api/imageProxy.ts

import { withImageProxy } from '@b-dev/next-proxima'

export default withImageProxy({ whitelistedPatterns: [/^https?:\/\/(.*).github.com/] })
```

and now you prefix the image you want to use:

```tsx
import NextImage from 'next/image'

export function SomeComponent() {
  const actualImageUrl = 'https://cdn-images-1.github.com/max/1024/1*xYoAR2XRmoCmC9SONuTb-Q.png'

  return <NextImage src={`/api/imageProxy?imageUrl=${actualImageUrl}`} width={700} height={300} />
}
```

## Support

If you have any questions or need assistance with the project, feel free to reach out to me directly at [zourdy@bereyziat.dev](mailto:zourdy@bereyziat.dev). I'm more than happy to help and address any concerns you may have.

## 🤲🏻 Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/Bereyziat-Development/next-proxima/issues/new) to discuss it, or directly create a pull request after you edit the _README.md_ file with necessary changes.
- Create individual PR for each suggestion.


### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
