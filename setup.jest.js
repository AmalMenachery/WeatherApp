/*
 * @jest-environment node
 */
import 'react-native-gesture-handler/jestSetup';
import 'cross-fetch/polyfill';
import axios from 'axios';
import { disableNetConnect } from 'nock';

// Jest tests should never make requests to the internet; use this to find culprits that try anyway
// https://github.com/nock/nock#enabledisable-real-http-requests
disableNetConnect();

// When using jsdom, axios will default to using the XHR adapter which
// can't be intercepted by nock. So, configure axios to use the node adapter.
// https://github.com/nock/nock#axios
axios.defaults.adapter = 'http';

global.fetch = require('cross-fetch');

global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
global.clearImmediate = global.clearImmediate || (id => global.clearTimeout(id));