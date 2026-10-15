package fovea.palette;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/** Groups swatches by role and reports the weakest contrast in each group. */
public final class ContrastReport {
    private static final double BODY_FLOOR = 90.0;

    public record Swatch(String role, String hex, double lc) {
        public Swatch {
            if (!hex.matches("#[0-9a-fA-F]{6}")) {
                throw new IllegalArgumentException("Invalid hex: " + hex);
            }
        }
    }

    private final List<Swatch> swatches;

    public ContrastReport(List<Swatch> swatches) {
        this.swatches = List.copyOf(swatches);
    }

    public Map<String, Optional<Swatch>> weakestByRole() {
        return swatches.stream()
            .collect(Collectors.groupingBy(Swatch::role,
                Collectors.minBy((a, b) -> Double.compare(Math.abs(a.lc()), Math.abs(b.lc())))));
    }

    @Override
    public String toString() {
        long passing = swatches.stream().filter(s -> Math.abs(s.lc()) >= BODY_FLOOR).count();
        return String.format("%d of %d swatches meet Lc %.0f", passing, swatches.size(), BODY_FLOOR);
    }

    public static void main(String[] args) {
        var report = new ContrastReport(List.of(
            new Swatch("fg", "#2f2a25", 95.1),
            new Swatch("muted", "#8a857c", 48.0)));
        System.out.println(report);
    }
}
