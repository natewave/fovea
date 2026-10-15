#include <algorithm>
#include <array>
#include <format>
#include <iostream>
#include <string_view>

namespace fovea {

struct Oklch {
    double l{}, c{}, h{};
};

template <typename T>
concept Colorlike = requires(T t) {
    { t.l } -> std::convertible_to<double>;
};

constexpr double kChromaCap = 0.12;

template <Colorlike C>
[[nodiscard]] constexpr C clamp_chroma(C color, double cap = kChromaCap) noexcept {
    color.c = std::min(color.c, cap);
    return color;
}

class Palette {
public:
    explicit Palette(std::string_view name) : name_{name} {}

    void add(const Oklch& color) { colors_[size_++ % colors_.size()] = clamp_chroma(color); }

    auto brightest() const -> Oklch {
        const auto end = colors_.begin() + std::min(size_, colors_.size());
        return *std::max_element(colors_.begin(), end,
                                 [](const auto& a, const auto& b) { return a.l < b.l; });
    }

private:
    std::string_view name_;
    std::array<Oklch, 16> colors_{};
    std::size_t size_ = 0;
};

}  // namespace fovea

int main() {
    fovea::Palette dusk{"Fovea Dusk"};
    dusk.add({0.905, 0.010, 80.0});
    dusk.add({0.78, 0.20, 155.0});
    const auto top = dusk.brightest();
    std::cout << std::format("L={:.3f} C={:.3f}\n", top.l, top.c);
}
