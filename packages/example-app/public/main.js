import { Runner } from "@vaporllm/inference-runner";

async function main() {
    const runner = new Runner({
        modelUrl: "/models/dummy_tiny_model.bin",
        backend: "auto",
        enableCache: true,
    });

    await runner.init();
    const output = await runner.runInference("Hello World");
    console.log("Inference Output:", output);
}

main().catch(console.error);
