using LogLens.Api.Models.Analysis;
using LogLens.Api.Services.Interfaces;

namespace LogLens.Api.Services;

public sealed class AnomalyDetectionService : IAnomalyDetectionService
{
    private static readonly string[] CriticalKeywords =
    [
        "timeout",
        "failed",
        "exception",
        "fatal",
        "critical",
        "unavailable",
        "connection refused",
        "out of memory"
    ];

    public AnomalyResult Analyze(string logs)
    {
        if (string.IsNullOrWhiteSpace(logs))
        {
            return new AnomalyResult
            {
                AnomalyDetected = false,
                Severity = "Low",
                Summary = "No logs were provided.",
                DetectedPatterns = []
            };
        }

        var lines = SplitLines(logs);
        var normalizedLines = lines
            .Select(line => line.Trim().ToLowerInvariant())
            .Where(line => !string.IsNullOrWhiteSpace(line))
            .ToList();

        var errorCount = CountEntriesContaining(normalizedLines, "error");
        var warningCount = CountEntriesContaining(normalizedLines, "warn");

        var repeatedMessages = DetectRepeatedMessages(normalizedLines);
        var criticalKeywords = DetectCriticalKeywords(normalizedLines);

        var patterns = new List<string>();

        if (errorCount >= 3)
        {
            patterns.Add($"High number of ERROR entries detected: {errorCount}");
        }

        if (warningCount >= 5)
        {
            patterns.Add($"High number of WARNING entries detected: {warningCount}");
        }

        if (repeatedMessages.Count > 0)
        {
            patterns.Add("Repeated log messages detected");
        }

        foreach (var keyword in criticalKeywords)
        {
            patterns.Add($"Critical keyword detected: {keyword}");
        }

        var anomalyDetected = patterns.Count > 0;
        var severity = DetermineSeverity(errorCount, warningCount, repeatedMessages.Count, criticalKeywords);

        return new AnomalyResult
        {
            AnomalyDetected = anomalyDetected,
            Severity = severity,
            Summary = anomalyDetected
                ? "Potential abnormal behavior detected in the provided logs."
                : "No significant anomaly detected using rule-based analysis.",
            DetectedPatterns = patterns
        };
    }

    private static IReadOnlyList<string> SplitLines(string logs)
    {
        return logs
            .Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries)
            .Select(line => line.Trim())
            .ToList();
    }

    private static int CountEntriesContaining(IEnumerable<string> lines, string keyword)
    {
        return lines.Count(line => line.Contains(keyword, StringComparison.OrdinalIgnoreCase));
    }

    private static IReadOnlyList<string> DetectRepeatedMessages(IReadOnlyList<string> lines)
    {
        return lines
            .GroupBy(line => NormalizeLogMessage(line))
            .Where(group => group.Count() >= 3)
            .Select(group => group.Key)
            .ToList();
    }

    private static IReadOnlyList<string> DetectCriticalKeywords(IReadOnlyList<string> lines)
    {
        return CriticalKeywords
            .Where(keyword => lines.Any(line => line.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            .ToList();
    }

    private static string NormalizeLogMessage(string line)
    {
        return line
            .Replace("error", "", StringComparison.OrdinalIgnoreCase)
            .Replace("warn", "", StringComparison.OrdinalIgnoreCase)
            .Replace("warning", "", StringComparison.OrdinalIgnoreCase)
            .Replace("info", "", StringComparison.OrdinalIgnoreCase)
            .Trim();
    }

    private static string DetermineSeverity(
        int errorCount,
        int warningCount,
        int repeatedMessageCount,
        IReadOnlyList<string> criticalKeywords)
    {
        if (errorCount >= 5 ||
            repeatedMessageCount > 0 ||
            criticalKeywords.Any(keyword => keyword is "fatal" or "critical" or "out of memory"))
        {
            return "High";
        }

        if (errorCount >= 3 ||
            warningCount >= 5 ||
            criticalKeywords.Count > 0)
        {
            return "Medium";
        }

        return "Low";
    }
}