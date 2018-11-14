/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "images/chloe.png",
    "revision": "4f2081b15efcb10a4c2ccb4d792b5f82"
  },
  {
    "url": "images/garfield.png",
    "revision": "b12e32ebdfec057bfc79733648bb23dc"
  },
  {
    "url": "images/marie.png",
    "revision": "f5fd4c981cd793c28686f21fddf27f71"
  },
  {
    "url": "images/meowth.png",
    "revision": "89936e7c3c2ff245e54f817e4606219a"
  },
  {
    "url": "images/ozone.png",
    "revision": "881c549926abcf49b24942f2bbc1c595"
  },
  {
    "url": "images/sylvester.png",
    "revision": "10af92cb2bd6fd219fd1a05b71102237"
  },
  {
    "url": "images/tom.png",
    "revision": "f81e208d1de8599e6510dfabbdc7c32b"
  },
  {
    "url": "index.html",
    "revision": "0c0eba641cf11d519a0c314e4232bf6d"
  },
  {
    "url": "scripts/combined.js",
    "revision": "c54858a6822d3e1e6046d6df50678b2a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
