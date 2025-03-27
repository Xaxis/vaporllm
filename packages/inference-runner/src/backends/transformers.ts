import { Backend } from "./backend.js";
import { pipeline, env } from "@xenova/transformers";

export class TransformersBackend implements Backend {
    private pipelineObj: any = null;

    public async init(options: { modelPath: string }): Promise<void> {
        console.log("TransformersBackend init with:", options.modelPath);

        // Because transformers.js only recognizes certain strings in env.backends,
        // we specify a valid array:
        //   "onnx", "tfjs", "wasm", or "cpu"
        // (Ignore "webgpu"/"webgl" because TypeScript definitions won't allow them.)
        // We'll try ONNX first, then TFJS, then WASM:
        // (Suppress TS warnings if needed.)
        // @ts-ignore
        env.backends = ["onnx", "tfjs", "wasm"];

        // Create the text-generation pipeline
        // This auto-loads or downloads the model
        this.pipelineObj = await pipeline("text-generation", options.modelPath);

        if (!this.pipelineObj) {
            throw new Error("Failed to load Transformers pipeline.");
        }
        console.log("TransformersBackend: pipeline loaded successfully.");
    }

    public async runInference(inputTokens: number[]): Promise<number[]> {
        if (!this.pipelineObj) {
            throw new Error("TransformersBackend not initialized");
        }

        // Naive decode from numeric tokens -> string
        const prompt = "User prompt: " + inputTokens
            .map((id) => String.fromCharCode(65 + (id % 26)))
            .join("");

        console.log("TransformersBackend: runInference with prompt:", prompt);

        // Actually run text generation
        const result = await this.pipelineObj(prompt, {
            max_new_tokens: 30,
            temperature: 0.8,
            top_p: 0.95,
        });

        if (!Array.isArray(result) || result.length < 1) {
            console.warn("Unexpected pipeline result:", result);
            return [];
        }

        const generatedText: string = result[0].generated_text;
        console.log("TransformersBackend: raw generated text:", generatedText);

        // Naive "re-tokenization"
        const outputTokens = generatedText.split(/\s+/).map((_, i) => 1000 + i);

        return outputTokens;
    }
}
