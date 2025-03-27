import { Runner } from "@vaporllm/inference-runner";

async function main() {
    const runner = new Runner({
        model: "name_of_model",
        backend: "auto",
        enableCache: true,
    });

    await runner.init();
    const output = await runner.runInference("Hello World");
    console.log("Inference Output:", output);
}

main().catch(console.error);
