# Third-party notices

Demotion bundles these open-licensed fonts (SIL Open Font License 1.1). Their license texts are in `public/fonts/licenses/`.

| Font | Source |
|---|---|
| Archivo (variable, wght + wdth) | https://github.com/Omnibus-Type/Archivo — via `@fontsource-variable/archivo` |
| Abril Fatface | https://github.com/TypeNetwork/Abril — via `@fontsource/abril-fatface` |
| Barlow Semi Condensed | https://github.com/jpt/barlow — via `@fontsource/barlow-semi-condensed` |
| JetBrains Mono (variable) | https://github.com/JetBrains/JetBrainsMono — via `@fontsource-variable/jetbrains-mono` |

Demotion is built on [Remotion](https://www.remotion.dev) (separate license, see https://www.remotion.dev/docs/terms-4-0) and, optionally, [three.js](https://threejs.org) (MIT) and [postprocessing](https://github.com/pmndrs/postprocessing) (Zlib).

The 2D illustration tools use [`@remotion/paths`](https://github.com/remotion-dev/remotion/tree/main/packages/paths) (MIT). It is installed as a dependency with its own license text. The optional 3D illustration tools use Three.js's SVGLoader and geometry utilities under Three.js's MIT license.

## Safari frame geometry

The browser frame in `src/components/Safari.tsx` includes SVG geometry from the [Magic UI Safari component](https://magicui.design/docs/components/safari). [Upstream license](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md)

MIT License

Copyright (c) Magic UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
