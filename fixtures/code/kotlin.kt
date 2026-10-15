package fovea.palette

import kotlin.math.abs

/** A swatch and its contrast against the background. */
data class Swatch(val role: String, val hex: String, val lc: Double) {
    init {
        require(hex.matches(Regex("#[0-9a-fA-F]{6}"))) { "Invalid hex: $hex" }
    }
}

enum class Polarity { LIGHT, DARK }

sealed interface Check {
    data class Pass(val swatch: Swatch) : Check
    data class Fail(val swatch: Swatch, val floor: Double) : Check
}

fun Swatch.check(floor: Double): Check =
    if (abs(lc) >= floor) Check.Pass(this) else Check.Fail(this, floor)

object Floors {
    const val BODY = 90.0
    const val COMMENT = 60.0
}

fun main() {
    val swatches = listOf(Swatch("fg", "#2f2a25", 95.1), Swatch("muted", "#8a857c", 48.0))
    swatches.map { it.check(Floors.COMMENT) }.forEach { result ->
        when (result) {
            is Check.Pass -> println("${result.swatch.role}: ok")
            is Check.Fail -> println("${result.swatch.role}: Lc ${"%.1f".format(result.swatch.lc)} < ${result.floor}")
        }
    }
    val strongest = swatches.maxByOrNull { it.lc } ?: return
    println("Strongest: ${strongest.role}")
}
