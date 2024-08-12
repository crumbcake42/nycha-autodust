import packageJson from './package.json' assert { type: 'json' };

const ICONS = {
    16: 'icons/levi16x16.png',
    32: 'icons/levi32x32.png',
    48: 'icons/levi48x48.png',
    128: 'icons/levi128x128.png',
};

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
    manifest_version: 3,
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    icons: ICONS,
    action: {
        default_icon: ICONS,
    },
    permissions: ['storage', 'sidePanel', 'tabs', 'activeTab'],
    // side_panel: {
    //   default_path: 'src/pages/sidepanel/index.html',
    // },
    background: {
        service_worker: 'src/pages/background/index.js',
        type: 'module',
    },
    externally_connectable: {
        matches: ['https://webapxp1.nycha.info/*'],
    },
    content_scripts: [
        {
            world: 'ISOLATED',
            matches: ['https://webapxp1.nycha.info/*'],
            js: ['src/pages/content/index.js'],
            run_at: 'document_end',
            // KEY for cache invalidation
            // css: ['assets/css/contentStyle<KEY>.chunk.css'],
        },
        {
            world: 'MAIN',
            matches: ['https://webapxp1.nycha.info/*'],
            js: ['src/pages/injected/index.js'],
            run_at: 'document_end',
        },
    ],
    devtools_page: 'src/pages/devtools/index.html',
    web_accessible_resources: [
        {
            resources: [
                'assets/js/*.js',
                'assets/css/*.css',
                'icons/levi128x128.png',
                'icons/levi32x32.png',
                'src/pages/content/index.js',
            ],

            matches: ['*://*/*'],
        },
    ],
};

export default manifest;
