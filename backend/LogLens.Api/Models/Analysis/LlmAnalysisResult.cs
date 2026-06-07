namespace LogLens.Api.Models.Analysis;

public sealed class LlmAnalysisResult
{
    public bool IncidentDetected { get; init; }

    public string Summary { get; init; } = string.Empty;

    public string Explanation { get; init; } = string.Empty;

    public IReadOnlyList<string> PossibleCauses { get; init; } = [];

    public IReadOnlyList<string> SuggestedFixes { get; init; } = [];

    public string Confidence { get; init; } = "Medium";
}