namespace LogLens.Api.Models.Requests;

public sealed class LogAnalysisRequest
{
    public string? Logs { get; init; }

    public IFormFile? File { get; init; }
}