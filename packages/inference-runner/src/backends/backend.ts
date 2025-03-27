export interface Backend {
    init(options: { modelPath: string }): Promise<void>;
    runInference(inputTokens: number[]): Promise<number[]>;
}
