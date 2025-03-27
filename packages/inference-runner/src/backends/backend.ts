export interface Backend {
    init(modelArtifacts: ArrayBuffer[]): Promise<void>;
    runInference(inputTokens: number[]): Promise<number[]>;
}