export class Loader {
    private modelArtifacts: ArrayBuffer[] = [];

    public async loadModel(modelUrl: string): Promise<void> {

        // @TODO
        // In a real scenario, we might fetch a manifest, then fetch multiple files
        // For now, assume there's just a single binary or something similar
        console.log(`Loader: Fetching model from ${modelUrl}`);
        const response = await fetch(modelUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Keep an array of artifact parts if needed
        this.modelArtifacts = [arrayBuffer];
    }

    public getArtifacts(): ArrayBuffer[] {
        return this.modelArtifacts;
    }
}