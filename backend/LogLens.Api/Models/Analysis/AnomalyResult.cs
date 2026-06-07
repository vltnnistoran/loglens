namespace LogLens.Api.Models.Analysis;

public sealed class AnomalyResult
{
    public bool AnomalyDetected { get; init; }

    public string Severity { get; init; } = "Low";

    public string Summary { get; init; } = "No anomaly detected.";

    public IReadOnlyList<string> DetectedPatterns { get; init; } = [];
}