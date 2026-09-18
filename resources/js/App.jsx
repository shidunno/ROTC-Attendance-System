import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const modules = import.meta.glob([
            './Pages/**/*.jsx',
            './Components/**/*.jsx',
        ]);

        const filename = name.split('/').pop();
        const match = Object.keys(modules).find((path) => path.endsWith(`/${filename}.jsx`));

        if (!match) {
            throw new Error(`Page not found: ${name}`);
        }

        return await resolvePageComponent(match, modules);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#7BA05B',
        showSpinner: true,
    },
});