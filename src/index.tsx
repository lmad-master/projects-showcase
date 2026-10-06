/* @refresh reload */
import { render } from 'solid-js/web';
import 'solid-devtools';

import App from './App';
import { Router, Route } from '@solidjs/router';

//Pages
import { NotFound, Home, ProjectDetail } from './pages';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Router root={App}>
    <Route path={"/"} component={Home} />
    <Route path={"/project/:id"} component={ProjectDetail} />
    <Route path={"*paramName"} component={NotFound} />
  </Router>
), root!);
