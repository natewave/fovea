using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fovea.Palette;

public enum Polarity { Light, Dark }

public sealed record Swatch(string Role, string Hex, double Lc)
{
    public bool Meets(double floor) => Math.Abs(Lc) >= floor;
}

[Obsolete("Use ContrastAudit instead.")]
public static class LegacyAudit { }

public sealed class ContrastAudit
{
    private readonly IReadOnlyList<Swatch> _swatches;

    public ContrastAudit(IEnumerable<Swatch> swatches) => _swatches = swatches.ToList();

    public IEnumerable<string> Failures(double floor) =>
        from s in _swatches
        where !s.Meets(floor)
        orderby Math.Abs(s.Lc)
        select $"{s.Role}: Lc {s.Lc:F1} < {floor}";

    public async Task<int> CountAsync(Func<Swatch, Task<bool>> predicate)
    {
        var results = await Task.WhenAll(_swatches.Select(predicate));
        return results.Count(ok => ok);
    }
}

public static class Program
{
    public static async Task Main()
    {
        var audit = new ContrastAudit(new[]
        {
            new Swatch("fg", "#2f2a25", 95.1),
            new Swatch("hint", "#8a857c", 41.2),
        });
        foreach (var line in audit.Failures(45)) Console.WriteLine(line);
        Console.WriteLine(await audit.CountAsync(s => Task.FromResult(s.Lc > 0)));
    }
}
