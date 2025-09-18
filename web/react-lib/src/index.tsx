import React, {useEffect, useState} from "react";

declare global {
    interface Window {
        _flutter?: any
    }
}

// URLs des assets packagés dans ton NPM (pas "import", juste URL)
const CDN_BASE = `https://cdn.jsdelivr.net/npm/${__PKG_NAME__}@${__PKG_VERSION__}/flutter/`;
const BOOTSTRAP_URL = `${CDN_BASE}bootstrap.js`;

let appPromise: Promise<any> | null = null;   // singleton de l'app Flutter
let appInstance: any | null = null;

function loadBootstrap(src: string) {
    if (document.querySelector(`script[data-flutter="${src}"]`)) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.defer = true;
        s.async = true;
        s.dataset.flutter = src;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
    });
}

async function ensureApp(renderer?: "skwasm" | "canvaskit") {
    if (appInstance) return appInstance;
    if (!appPromise) {
        appPromise = (async () => {
            await loadBootstrap(BOOTSTRAP_URL);              // charger <script> classique
            return new Promise<any>((resolve) => {
                //window._flutter!.buildConfig.builds[0].mainJsPath = CDN_BASE + "main.dart.js";
                window._flutter!.loader.load({
                    config: {
                        assetBase: CDN_BASE,                                 // où sont les assets
                        entrypointBaseUrl: CDN_BASE,              // base pour main.dart.js
                        renderer,                                  // 'skwasm' ou 'canvaskit'
                    },
                    onEntrypointLoaded: async (engineInitializer: any) => {
                        const engine = await engineInitializer.initializeEngine({
                            assetBase: CDN_BASE,
                            multiViewEnabled: true
                        });
                        const app = await engine.runApp();         // renvoie l'app multi-view
                        appInstance = app;
                        resolve(app);
                    },
                });
            });
        })();
    }
    return appPromise;
}

export type FlutterWidgetProps = {
    greeting: string;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    assetBase?: string;
    renderer?: "skwasm" | "canvaskit";
};

export function FlutterWidget({
                                  greeting,
                                  height = 420,
                                  className,
                                  style,
                                  renderer,
                              }: FlutterWidgetProps) {
    const id: string = "flutterwidget";//-" + Math.random().toString(36).substring(7);
    const [viewId, setViewId] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Initialise (une fois) puis ajoute une view pour ce composant
        ensureApp(renderer).then((app) => {
            if (cancelled) return;

            // si la view existe déjà (prop maj), on la remplace pour pousser initialData
            if (viewId != null) app.removeView(viewId);
            setViewId(app.addView({
                hostElement: document.querySelector('#' + id),
                initialData: {greeting},
                viewConstraints: {minWidth: 500, maxWidth: Infinity, minHeight: height, maxHeight: height},
            }));
        });

        return () => {
            cancelled = true;
            if (appInstance && viewId != null) {
                appInstance.removeView(viewId);
                setViewId(null);
            }
        };
    }, [greeting, renderer]);

    return (<div id={id} className={className} style={{width: "100%", height, ...style}}/>);
}

export default FlutterWidget;
