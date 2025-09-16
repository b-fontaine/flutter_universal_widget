<template>
  <div
      ref="host"
      :class="klass"
      :style="[ { width: '100%', height: `${height}px` }, style ]"
  />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';

type Renderer = 'skwasm' | 'canvaskit';

const props = defineProps<{
  greeting: string;
  height?: number;
  assetBase?: string;         // si tu auto-héberges (CDN, /public/flutter, …)
  renderer?: Renderer;        // optionnel: forcer le renderer
  class?: string;
  style?: Record<string, string | number>;
}>();

const height = computed(() => props.height ?? 420);
const klass = computed(() => props.class);

const host = ref<HTMLElement | null>(null);

// URLs des assets packagés (résolus sans les bundler)
const BOOTSTRAP_URL = new URL('../flutter/flutter_bootstrap.js', import.meta.url).toString();
const DEFAULT_ASSET_BASE = new URL('../flutter/', import.meta.url).toString();

let app: any | null = null;
let appPromise: Promise<any> | null = null;
let viewId: number | null = null;

function loadBootstrap(src: string) {
  if (document.querySelector(`script[data-flutter="${src}"]`)) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.defer = true; s.async = true; s.dataset.flutter = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

async function ensureApp(assetBase: string, renderer?: Renderer) {
  if (app) return app;
  if (!appPromise) {
    appPromise = (async () => {
      await loadBootstrap(BOOTSTRAP_URL);
      return new Promise<any>((resolve) => {
        (window as any)._flutter.loader.load({
          config: {
            assetBase,                       // où trouver assets & main.dart.js
            entrypointBaseUrl: assetBase,
            renderer,                        // 'skwasm' | 'canvaskit'
          },
          onEntrypointLoaded: async (engineInitializer: any) => {
            const engine = await engineInitializer.initializeEngine({ multiViewEnabled: true });
            const _app = await engine.runApp(); // multi-view
            app = _app;
            resolve(_app);
          },
        });
      });
    })();
  }
  return appPromise;
}

async function mountOrRemountView() {
  const base = props.assetBase ?? DEFAULT_ASSET_BASE;
  const a = await ensureApp(base, props.renderer);
  if (!host.value) return;
  if (viewId != null) a.removeView(viewId);
  viewId = a.addView({
    hostElement: host.value,
    initialData: { greeting: props.greeting },
    viewConstraints: { maxWidth: Infinity, maxHeight: Infinity },
  });
}

onMounted(mountOrRemountView);
watch(() => props.greeting, () => { void mountOrRemountView(); });

onBeforeUnmount(() => {
  if (app && viewId != null) {
    app.removeView(viewId);
    viewId = null;
  }
});
</script>
