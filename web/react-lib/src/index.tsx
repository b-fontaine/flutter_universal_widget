import React, { useEffect, useRef } from "react";

declare global { interface Window { _flutter?: any } }

// URLs des assets packagés dans ton NPM (pas "import", juste URL)
const BOOTSTRAP_URL = new URL("../flutter/flutter_bootstrap.js", import.meta.url).toString();
const DEFAULT_ASSET_BASE = new URL("../flutter/", import.meta.url).toString();

let appPromise: Promise<any> | null = null;   // singleton de l'app Flutter
let appInstance: any | null = null;

function loadBootstrap(src: string) {
    if (document.querySelector(`script[data-flutter="${src}"]`)) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src; s.defer = true; s.async = true; s.dataset.flutter = src;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
    });
}

async function ensureApp(assetBase: string, renderer?: "skwasm" | "canvaskit") {
    if (appInstance) return appInstance;
    if (!appPromise) {
        appPromise = (async () => {
            await loadBootstrap(BOOTSTRAP_URL);              // charger <script> classique
            return new Promise<any>((resolve) => {
                window._flutter!.loader.load({
                    config: {
                        assetBase,                                 // où sont les assets
                        entrypointBaseUrl: assetBase,              // base pour main.dart.js
                        renderer,                                  // 'skwasm' ou 'canvaskit'
                    },
                    onEntrypointLoaded: async (engineInitializer: any) => {
                        const engine = await engineInitializer.initializeEngine({ multiViewEnabled: true });
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
    /** Si tu auto-héberges les assets (CDN, /public/flutter, …) */
    assetBase?: string;
    /** Forcer le renderer Flutter web si besoin */
    renderer?: "skwasm" | "canvaskit";
};

export function FlutterWidget({
                                  greeting,
                                  height = 420,
                                  className,
                                  style,
                                  assetBase,
                                  renderer,
                              }: FlutterWidgetProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const viewIdRef = useRef<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        const base = assetBase ?? DEFAULT_ASSET_BASE;

        // Initialise (une fois) puis ajoute une view pour ce composant
        ensureApp(base, renderer).then((app) => {
            if (cancelled || !hostRef.current) return;

            // si la view existe déjà (prop maj), on la remplace pour pousser initialData
            if (viewIdRef.current != null) app.removeView(viewIdRef.current);
            viewIdRef.current = app.addView({
                hostElement: hostRef.current,
                initialData: { greeting },
                viewConstraints: { maxWidth: Infinity, maxHeight: Infinity },
            });
        });

        return () => {
            cancelled = true;
            if (appInstance && viewIdRef.current != null) {
                appInstance.removeView(viewIdRef.current);
                viewIdRef.current = null;
            }
        };
    }, [greeting, assetBase, renderer]);

    return <div ref={hostRef} className={className} style={{ width: "100%", height, ...style }} />;
}

export default FlutterWidget;
