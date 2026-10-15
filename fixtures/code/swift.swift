import Foundation

/// A color in OKLCH.
struct Oklch: Equatable, Sendable {
    var l: Double
    var c: Double
    var h: Double
}

enum Polarity: String, CaseIterable {
    case light, dark
}

protocol ContrastMeasuring {
    func lc(text: Oklch, surface: Oklch) -> Double
}

struct ApproximateContrast: ContrastMeasuring {
    func lc(text: Oklch, surface: Oklch) -> Double {
        (surface.l - text.l) * 100
    }
}

final class Palette {
    private(set) var swatches: [String: Oklch] = [:]
    let polarity: Polarity

    init(polarity: Polarity) {
        self.polarity = polarity
    }

    func add(_ name: String, _ color: Oklch) {
        guard color.c <= 0.15 else {
            print("Skipping \(name): chroma \(color.c) is above the cap")
            return
        }
        swatches[name] = color
    }

    func weakest(using measure: some ContrastMeasuring, on surface: Oklch) -> String? {
        let strength = { (color: Oklch) in abs(measure.lc(text: color, surface: surface)) }
        return swatches.min { strength($0.value) < strength($1.value) }?.key
    }
}

let day = Palette(polarity: .light)
day.add("fg", Oklch(l: 0.29, c: 0.012, h: 70))
day.add("muted", Oklch(l: 0.62, c: 0.01, h: 70))
if let name = day.weakest(using: ApproximateContrast(), on: Oklch(l: 0.97, c: 0.012, h: 85)) {
    print("Weakest: \(name)")
}
