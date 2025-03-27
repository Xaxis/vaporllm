# vaporllm

A client-based distributed inference framework.

`vaporllm` enables real-time, cross-browser model inference entirely in the frontend, with optional peer-to-peer coordination. Models are executed locally in the browser using WebAssembly (WASM), WebGL, and WebGPU (when available), and clients can optionally serve inference requests to other users in the network.

## 🔍 What It Is

- **Web-native LLM serving** — run quantized models directly in the browser.
- **Fully decentralized or private** — use local-only mode or connect to peers.
- **Zero backend inference costs** — the browser *is* the cloud.
- **Streaming, multi-model, token-by-token generation** — all from within your app.

## 🧩 Core Components

### 🧠 Inference Runner
- Loads and runs full LLMs locally via WASM/WebGL/WebGPU.
- Hosts one or more models and serves inference requests.
- Caches model binaries and weights in IndexedDB.

### 🔧 Client SDK
- Developer interface to define and invoke models for their apps.
- Manages routing of inference requests to local or remote Inference Runners.
- Supports streaming token output and privacy toggles.

### 🌐 Orchestration Server
- Tracks online clients and the models they host.
- Routes inference requests to available peers.
- Optionally proxies requests when P2P fails.

### 🛰️ App Server
- Serves static app shell and model binaries.
- Provides versioning and manifest metadata for client-side model loading.

## ✅ Key Features

- Full model execution with no server-side inference.
- Runs on most modern browsers with WASM +/- WebGL +/- WebGPU support.
- Offline and privacy-first modes.
- Peer-to-peer inference sharing (opt-in).
- Extensible model format support (ONNX, GGML-to-WASM, WebLLM, etc).

## 🧪 Browser (Client) Support

`vaporllm` is designed to work **anywhere the modern web runs**, using a progressive fallback strategy for inference execution:

### Inference Runner Backend Fallback Strategy:

| Tier      | Backend             | Tech Stack                  | Performance      | Browser Support     |
|-----------|---------------------|-----------------------------|------------------|----------------------|
| 🥇 Tier 1 | **WebGPU**          | WASM + GPU shaders          | ⚡ Fastest        | ✅ Chrome, Edge, Firefox Nightly |
| 🥈 Tier 2 | **WebGL**           | GLSL shaders via ONNX.js    | ⚙️ Medium         | ✅ All major browsers |
| 🥉 Tier 3 | **WASM + CPU**      | SIMD + multithreaded WASM   | 🐢 Slowest        | ✅ Universal          |

The Inference Runner automatically selects the most performant backend available in the client’s environment. This ensures your app is both widely compatible **and** high-performance where possible.

- **WASM and WebGL** are fully supported in all modern browsers.
- **WebGPU** support is currently available in Chromium-based browsers and Firefox Nightly, with broader support expected soon.  
  ([MDN: WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API))


## 🌍 Example Use Cases

- Decentralized AI chat interfaces.
- Decentralized agent frameworks.
- Privacy-preserving in-browser assistants.
- Offline-capable LLM experiences.
- Community-powered apps that share compute.

## 🚧 Roadmap (WIP)

- [ ] Basic runtime support for ONNX/WebLLM models
- [ ] WebSocket-based orchestrator for peer registry
- [ ] SDK routing with local/remote inference logic
- [ ] Token streaming and session state management
- [ ] P2P mesh fallback with direct browser communication
- [ ] Dashboard for monitoring active peers/models

---

Designed for a future where intelligence is ambient, user-controlled, and free of centralized bottlenecks.

> ✨ The cloud is vapor.
