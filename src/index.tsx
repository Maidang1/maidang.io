/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import 'uno.css';
import './index.css';
import Routers from './router';

render(
  () => (
    <Router>
      <Routers />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);
