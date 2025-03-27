export interface ModelInfo {
    name: string;
    library: "transformers" | "onnx" | "llamacpp" | "mlc" | "other";
    path?: string;
    // @TODO
    // Possibly add more fields: e.g. for quantization, or a specific config
}

export const MODEL_REGISTRY: Record<string, ModelInfo> = {
    "distilgpt2": {
        name: "DistilGPT2",
        library: "transformers",
        path: "/models/distilgpt2" // or you might rely on the default HF location???
    },
    "gpt2": {
        name: "GPT2",
        library: "transformers",
        path: "/models/gpt2"
    },
    "onnx-gpt2": {
        name: "GPT2-ONNX",
        library: "onnx",
        path: "/models/onnx/gpt2"
    },
    "llama2-7b": {
        name: "LLaMA2-7B",
        library: "mlc",
        path: "/models/llama2-7b"
    }

    // @TODO
    // add more...
};
