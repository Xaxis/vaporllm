// @TODO
// import init, { run_inference } from "./vaporllm_wasm_engine.js";


export interface ModelManifestEntry {
    url: string;
    type: "engine" | "weight";
    description?: string;
}

export interface ModelManifest {
    // A list of all files needed by the model
    files: ModelManifestEntry[];
}

/**
 * Loader class responsible for fetching:
 *  - A WASM "engine" (if needed)
 *  - One or more .bin or .json model weight files
 *  - (Optionally) a "manifest" that enumerates multiple weight shards
 *
 * Internally, it stores each fetched file as an ArrayBuffer in `this.artifacts`,
 * preserving the order you decide (e.g. engine first, then weights).
 *
 * Then you can retrieve them via `getArtifacts()` for your backend init logic.
 */
export class Loader {
    private artifacts: ArrayBuffer[] = [];

    /**
     * Fetch a single WASM engine file from a known URL
     * and push it into `this.artifacts` as the first item.
     *
     * Example usage:
     *    await loader.loadEngine("/models/engine.wasm");
     */
    public async loadEngine(engineUrl: string): Promise<void> {
        console.log(`Loading WASM engine from: ${engineUrl}`);
        const response = await fetch(engineUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch WASM engine at ${engineUrl}`);
        }
        const wasmBuffer = await response.arrayBuffer();

        // This is typically the first artifact for WASM backend
        this.artifacts.push(wasmBuffer);

        console.log(`Successfully loaded engine.wasm (${wasmBuffer.byteLength} bytes)`);
    }

    /**
     * Fetch a single model weight file (e.g. .bin) from a known URL
     * and push it to `this.artifacts`. Typically, this is called
     * after `loadEngine()` if you're using the WASM backend.
     *
     * Example usage:
     *    await loader.loadModel("/models/dummy_tiny_model.bin");
     */
    public async loadModel(modelUrl: string): Promise<void> {
        console.log(`Loading model from: ${modelUrl}`);
        const response = await fetch(modelUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch model at ${modelUrl}`);
        }
        const modelBuffer = await response.arrayBuffer();

        // This might be the second artifact if you're using WASM engine + .bin
        // or the only artifact if you're purely a WebGL/WebGPU backend
        this.artifacts.push(modelBuffer);

        console.log(`Successfully loaded model.bin (${modelBuffer.byteLength} bytes)`);
    }

    /**
     * If you have a manifest (JSON) that lists multiple files (shards, etc.),
     * you can fetch that manifest, parse it, and then download each file in order.
     *
     * The order you push them into `this.artifacts` is up to you.
     * For WASM, you'd typically ensure the engine is first, then weight shards, etc.
     *
     * Example usage:
     *    await loader.loadFromManifest("/models/manifest.json");
     */
    public async loadFromManifest(manifestUrl: string): Promise<void> {
        console.log(`Loading manifest from: ${manifestUrl}`);
        const manifestResp = await fetch(manifestUrl);
        if (!manifestResp.ok) {
            throw new Error(`Failed to fetch manifest at ${manifestUrl}`);
        }
        const manifestJson = await manifestResp.json();
        const manifest = manifestJson as ModelManifest;

        // We expect manifest.files to be an array of entries
        console.log(`Parsed manifest with ${manifest.files.length} entries.`);

        // Example logic to fetch each file in the listed order
        for (const entry of manifest.files) {
            await this.fetchAndStore(entry);
        }
    }

    /**
     * Helper method for loadFromManifest that fetches a single file
     * and pushes its ArrayBuffer to `this.artifacts`.
     */
    private async fetchAndStore(entry: ModelManifestEntry): Promise<void> {
        console.log(`Fetching ${entry.type} from ${entry.url}`);
        const resp = await fetch(entry.url);
        if (!resp.ok) {
            throw new Error(`Failed to fetch ${entry.type} at ${entry.url}`);
        }
        const buf = await resp.arrayBuffer();
        this.artifacts.push(buf);
        console.log(`Fetched ${entry.type} ${entry.url} (${buf.byteLength} bytes)`);
    }

    /**
     * Returns the collected artifacts in the order they were loaded/pushed.
     * For example:
     *   artifacts[0] = engine.wasm (if using WASM)
     *   artifacts[1..N] = model weight shards
     */
    public getArtifacts(): ArrayBuffer[] {
        return this.artifacts;
    }

    /**
     * (Optional) If you want to clear out the artifacts for some reason,
     * e.g. reloading a different model or freeing memory,
     * you can provide a reset method:
     */
    public clearArtifacts(): void {
        this.artifacts = [];
    }
}
