import { Runner } from "@vaporllm/inference-runner";

async function main() {
    const runner = new Runner({
        model: "gpt2"
    });

    await runner.init();
    const output = await runner.runInference("Hello World");
    console.log("Inference Output:", output);
}

main().catch(console.error);
