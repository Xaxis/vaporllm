import { Backend } from "./backend.js";

export class WasmBackend implements Backend {
    private wasmExports: WebAssembly.Exports | null = null;
    private weightBuffers: ArrayBuffer[] = [];

    public async init(modelArtifacts: ArrayBuffer[]): Promise<void> {
        if (!modelArtifacts.length) {
            throw new Error("No artifacts provided to WASM backend.");
        }

        // 1) The first artifact is the compiled .wasm "engine"
        const wasmBinary = modelArtifacts[0];
        const { instance } = await WebAssembly.instantiate(wasmBinary, {
            // importObject: supply any imports needed
        });
        this.wasmExports = instance.exports;

        // 2) Any subsequent artifacts are weights (if used)
        this.weightBuffers = modelArtifacts.slice(1);

        // TODO: parse weights or copy them into WASM memory if needed
        console.log("WASM backend initialized. Weights:", this.weightBuffers.length);
    }

    public async runInference(inputTokens: number[]): Promise<number[]> {
        if (!this.wasmExports) {
            throw new Error("WASM backend not initialized. Call init() first.");
        }

        // In real code, we will implement:
        // 1) Copy inputTokens into WASM memory
        // 2) Call an exported function to run the model
        // 3) Read the output from WASM memory

        console.log("WASM: Running inference on tokens:", inputTokens);
        return [...inputTokens];
    }
}
