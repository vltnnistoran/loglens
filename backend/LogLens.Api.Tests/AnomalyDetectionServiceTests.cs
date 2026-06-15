using LogLens.Api.Services;
using Xunit;

namespace LogLens.Api.Tests;

public sealed class AnomalyDetectionServiceTests
{
    private readonly AnomalyDetectionService _sut = new();

    // Empty / null input

    [Fact]
    public void Analyze_EmptyString_ReturnsNoAnomaly()
    {
        var result = _sut.Analyze(string.Empty);

        Assert.False(result.AnomalyDetected);
        Assert.Equal("Low", result.Severity);
        Assert.Empty(result.DetectedPatterns);
    }

    [Fact]
    public void Analyze_WhitespaceOnly_ReturnsNoAnomaly()
    {
        var result = _sut.Analyze("   \n   \r\n   ");

        Assert.False(result.AnomalyDetected);
        Assert.Empty(result.DetectedPatterns);
    }

    // ERROR count thresholds

    [Fact]
    public void Analyze_TwoErrorLines_NoAnomalyDetected()
    {
        var logs = "ERROR db connection lost\nERROR db connection lost";

        var result = _sut.Analyze(logs);

        Assert.False(result.AnomalyDetected);
        Assert.DoesNotContain(result.DetectedPatterns, p => p.Contains("ERROR"));
    }

    [Fact]
    public void Analyze_ThreeErrorLines_AnomalyDetectedWithMediumSeverity()
    {
        var logs = "ERROR one\nERROR two\nERROR three";

        var result = _sut.Analyze(logs);

        Assert.True(result.AnomalyDetected);
        Assert.Equal("Medium", result.Severity);
        Assert.Contains(result.DetectedPatterns, p => p.Contains("ERROR"));
    }

    [Fact]
    public void Analyze_FiveErrorLines_HighSeverity()
    {
        var logs = string.Join("\n", Enumerable.Range(1, 5).Select(i => $"ERROR event {i}"));

        var result = _sut.Analyze(logs);

        Assert.Equal("High", result.Severity);
    }

    // WARNING count threshold

    [Fact]
    public void Analyze_FourWarnLines_NoAnomalyFromWarningsAlone()
    {
        var logs = string.Join("\n", Enumerable.Range(1, 4).Select(i => $"WARN event {i}"));

        var result = _sut.Analyze(logs);

        Assert.DoesNotContain(result.DetectedPatterns, p => p.Contains("WARNING"));
    }

    [Fact]
    public void Analyze_FiveWarnLines_AnomalyDetectedWithMediumSeverity()
    {
        var logs = string.Join("\n", Enumerable.Range(1, 5).Select(i => $"WARN event {i}"));

        var result = _sut.Analyze(logs);

        Assert.True(result.AnomalyDetected);
        Assert.Equal("Medium", result.Severity);
        Assert.Contains(result.DetectedPatterns, p => p.Contains("WARNING"));
    }

    // Repeated messages

    [Fact]
    public void Analyze_MessageRepeatedTwice_NotFlaggedAsRepeated()
    {
        var logs = "INFO heartbeat ok\nINFO heartbeat ok";

        var result = _sut.Analyze(logs);

        Assert.DoesNotContain(result.DetectedPatterns, p => p.Contains("Repeated"));
    }

    [Fact]
    public void Analyze_MessageRepeatedThreeTimes_FlaggedAndHighSeverity()
    {
        var logs = "INFO heartbeat ok\nINFO heartbeat ok\nINFO heartbeat ok";

        var result = _sut.Analyze(logs);

        Assert.True(result.AnomalyDetected);
        Assert.Equal("High", result.Severity);
        Assert.Contains(result.DetectedPatterns, p => p.Contains("Repeated"));
    }

    // Critical keywords

    [Theory]
    [InlineData("timeout")]
    [InlineData("failed")]
    [InlineData("exception")]
    [InlineData("unavailable")]
    [InlineData("connection refused")]
    public void Analyze_MediumSeverityKeyword_MediumSeverityAndPatternAdded(string keyword)
    {
        var logs = $"INFO service started\nERROR {keyword} during request\nINFO retrying";

        var result = _sut.Analyze(logs);

        Assert.True(result.AnomalyDetected);
        Assert.Contains(result.DetectedPatterns, p => p.Contains(keyword));
    }

    [Theory]
    [InlineData("fatal")]
    [InlineData("critical")]
    [InlineData("out of memory")]
    public void Analyze_HighSeverityKeyword_HighSeverity(string keyword)
    {
        var logs = $"INFO starting up\nERROR {keyword} encountered";

        var result = _sut.Analyze(logs);

        Assert.Equal("High", result.Severity);
    }

    [Fact]
    public void Analyze_NoKeywordsNoErrors_ReturnsNoAnomaly()
    {
        var logs = "INFO application started\nINFO request processed\nINFO shutdown complete";

        var result = _sut.Analyze(logs);

        Assert.False(result.AnomalyDetected);
        Assert.Equal("Low", result.Severity);
        Assert.Empty(result.DetectedPatterns);
    }

    // Pattern list accuracy

    [Fact]
    public void Analyze_MultipleSignals_AllPatternsPresent()
    {
        var logs =
            "ERROR timeout connecting to db\n" +
            "ERROR timeout connecting to db\n" +
            "ERROR timeout connecting to db\n" +
            "WARN retry attempt 1\n" +
            "WARN retry attempt 2\n" +
            "WARN retry attempt 3\n" +
            "WARN retry attempt 4\n" +
            "WARN retry attempt 5";

        var result = _sut.Analyze(logs);

        Assert.Contains(result.DetectedPatterns, p => p.Contains("ERROR"));
        Assert.Contains(result.DetectedPatterns, p => p.Contains("WARNING"));
        Assert.Contains(result.DetectedPatterns, p => p.Contains("timeout"));
        Assert.Contains(result.DetectedPatterns, p => p.Contains("Repeated"));
    }

    // Summary text

    [Fact]
    public void Analyze_WithAnomaly_SummaryIndicatesAbnormalBehavior()
    {
        var logs = "ERROR fatal crash occurred";

        var result = _sut.Analyze(logs);

        Assert.Contains("abnormal", result.Summary, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Analyze_WithoutAnomaly_SummaryIndicatesNoAnomaly()
    {
        var logs = "INFO all systems operational";

        var result = _sut.Analyze(logs);

        Assert.Contains("No significant anomaly", result.Summary, StringComparison.OrdinalIgnoreCase);
    }
}