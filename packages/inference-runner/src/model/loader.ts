export class Loader {
    // @TODO - Store artifacts or do custom fetching logic if needed
    public async loadModel(modelPath: string): Promise<void> {
        // For transformers.js or ONNX, probably nothing to do manually here;
        // or we might fetch metadata of some sort?
        console.log(`Loader: (Optional) Doing nothing for modelPath=${modelPath}`);
    }
}