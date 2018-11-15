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
    "revision": "82eeb0ba87fe6c963aa7734a05ef7043"
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
    "revision": "b3e6becc49fe1cffe2ee8f3a0c097550"
  },
  {
    "url": "scripts/combined.js",
    "revision": "750b750a357cdff2df31e4d9ded41be1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});