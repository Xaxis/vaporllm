import { Loader } from "./loader.js";
import { Tokenizer } from "./tokenizer.js";
import { MODEL_REGISTRY } from "./registry.js";

import { Backend } from "../backends/backend.js";
import { TransformersBackend } from "../backends/transformers.js";
// import { OnnxBackend } from "../backends/onnx.js";

export interface RunnerConfig {
    model: string;
}

export class Runner {
    private loader: Loader;
    private tokenizer: Tokenizer;
    private backend: Backend | null = null;

    constructor(private config: RunnerConfig) {
        this.loader = new Loader();
        this.tokenizer = new Tokenizer();
    }

    public async init(): Promise<void> {
        // 1) Lookup model info from the registry
        const found = MODEL_REGISTRY[this.config.model];
        if (!found) {
            throw new Error(`Unknown model "${this.config.model}" not in registry!`);
        }

        // 2) If the model has a path, load it (optional)
        if (found.path) {
            await this.loader.loadModel(found.path);
        }

        // 3) Create the appropriate backend based on the library
        switch (found.library) {
            case "transformers":
                this.backend = new TransformersBackend();
                break;
            case "onnx":
                // this.backend = new OnnxBackend();
                break;
            default:
                throw new Error(`Unsupported library: ${found.library}`);
        }

        // 4) Initialize the backend
        const modelPath = found.path || this.config.model;
        // If no path is given, we use the model's name for HF auto-download (e.g. "gpt2").
        // @ts-ignore
        await this.backend.init({ modelPath });

        console.log(`Runner initialized for model "${this.config.model}" using library="${found.library}".`);
    }

    public async runInference(input: string): Promise<string> {
        if (!this.backend) {
            throw new Error("Runner not initialized. Call init() first.");
        }

        // 1) Tokenize input
        const tokens = this.tokenizer.tokenize(input);
        console.log("Tokens:", tokens);

        // 2) Run inference
        const outputTokens = await this.backend.runInference(tokens);

        // 3) Convert tokens to string
        const outputString = outputTokens.join(" ");
        return outputString;
    }
}
