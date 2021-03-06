# BookmarkletsGo

https://bookmarkletsgo.github.io

Easy find and install bookmarklets.

## Features

- Easy use all bookmarklets by install one bookmarklet
- Many awesome bookmarklets
- Safe bookmarklets by open source and code review

## Related

- [Bookmarkleter](https://github.com/chriszarate/bookmarkleter) - You have JavaScript. You need a [bookmarklet][bookmarklet]. This does that.
- [RadLikeWhoa/bookmarklets](https://github.com/RadLikeWhoa/bookmarklets) - bookmarklets is a curated list of, you guessed it, bookmarklets that are useful on the web.

## Related Add ons

- https://addons.mozilla.org/en-US/firefox/addon/bookmarklets-context-menu/

## Development

```sh
git clone https://github.com/bookmarkletsgo/bookmarkletsgo.git
npm install
npm start
```

Then checkout `http://localhost:8090/test.html` and `http://localhost:8090/bookmarklets.html` .

To build production version, run

```sh
npm run build:prod
```

## TODO list

- [x] Save favorite bookmarklets
- Category of bookmarklets
- Search bookmarklets
- Update version of main bookmarklet
- Update version of saved bookmarklets
- Contribution guideline
- [x] Build bookmarklet tool
- [x] Github action for build bookmarklet
- Bookmarklet information
  - title, description, version
  - category, tags
  - browser compatibility
- i18n
- Support settings for individual packages
  - e.g. save selected search engine
- Add custom bookmarklets source. e.g. add my bookmarklets to bookmarkletsgo, and only I can see them.
- Keyboard shortcuts. Press 1-9 to select and execute a bookmarklet.

## License

Copyright (c) 2020 [dailyrandomphoto][my-url]. Licensed under the [MIT license][license-url].

[my-url]: https://github.com/dailyrandomphoto
[license-url]: LICENSE
[bookmarklet]: http://en.wikipedia.org/wiki/Bookmarklet "Wikipedia entry on Bookmarklets"
