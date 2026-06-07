namespace LogLens.Api.Models.Responses;

public sealed class LogAnalysisResponse
{
    public bool AnomalyDetected { get; init; }

    public string Severity { get; init; } = "Low";

    public string Summary { get; init; } = string.Empty;

    public string Explanation { get; init; } = string.Empty;

    public IReadOnlyList<string> PossibleCauses { get; init; } = [];

    public IReadOnlyList<string> SuggestedFixes { get; init; } = [];

    public string Confidence { get; init; } = "Medium";

    public IReadOnlyList<string> DetectedPatterns { get; init; } = [];
}