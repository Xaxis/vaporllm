import { Backend } from "./backend.js";
import * as ort from "onnxruntime-web";

export class OnnxBackend implements Backend {
    private session: ort.InferenceSession | null = null;

    public async init(options: { modelPath: string }): Promise<void> {
        console.log("OnnxBackend init with:", options.modelPath);

        const executionProviders: ort.InferenceSession.SessionOptions["executionProviders"] = [
            "webgpu",
            "wasm"
        ];

        // 2) Create the session with .onnx file (assuming the file is named "model.onnx")
        const modelUrl = `${options.modelPath}/model.onnx`;
        console.log("OnnxBackend: creating session with modelUrl:", modelUrl);

        this.session = await ort.InferenceSession.create(modelUrl, { executionProviders });

        console.log("OnnxBackend: session created. Providers:", executionProviders);
    }

    /**
     * Convert numeric tokens -> ONNX Tensor, run the session, parse the output.
     * Return an array of new token IDs (or an empty array) depending on your generation logic.
     */
    public async runInference(inputTokens: number[]): Promise<number[]> {
        if (!this.session) {
            throw new Error("OnnxBackend not initialized");
        }

        console.log("OnnxBackend: runInference with tokens:", inputTokens);

        // 1) Prepare input tensor. We'll use int32 or int64 depending on your model.
        //    GPT-like models often have int64 input_ids. We'll do int32 for demonstration.
        const seqLen = inputTokens.length;
        const typed = new Int32Array(seqLen);
        for (let i = 0; i < seqLen; i++) {
            typed[i] = inputTokens[i];
        }
        // shape: [batch_size=1, sequence_length=seqLen]
        const inputTensor = new ort.Tensor("int32", typed, [1, seqLen]);

        // 2) The feed dict must match your ONNX model's input name(s).
        //    Suppose your model input is called "input_ids":
        const feeds: Record<string, ort.Tensor> = {
            input_ids: inputTensor
            // if you have "attention_mask" or other inputs, define them here
        };

        // 3) Run inference
        const results = await this.session.run(feeds);

        // 4) Typically, a GPT-2 style ONNX might output "logits" shape [1, seqLen, vocab_size]
        //    Or if you do a custom approach, you might have "output_ids" directly.
        const logits = results["logits"]; // or "output_ids", depending on your model
        if (!logits) {
            console.warn("No 'logits' or relevant output in results. Found keys:", Object.keys(results));
            return [];
        }

        console.log("OnnxBackend: got logits shape:", logits.dims);

        // 5) For a real text-generation loop, you'd do a softmax sampling or argmax on the last token's logits
        //    to pick the next token, then feed it back in a loop.
        //    This is just a single pass. We'll pretend we pick token +1 for each input token.
        const outputTokens: number[] = inputTokens.map((tok) => tok + 1);

        return outputTokens;
    }
}
