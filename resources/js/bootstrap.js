import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import { getAuthContext } from './authContext';

window.axios.defaults.headers.common['X-ROTC-Auth-Context'] = getAuthContext();