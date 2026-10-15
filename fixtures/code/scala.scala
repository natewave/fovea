package fovea.palette

import scala.util.{Failure, Success, Try}

/** Polarity of a variant. */
enum Polarity:
  case Light, Dark

sealed trait Role
case object Error extends Role
case object Warning extends Role
final case class Accent(name: String, tier: Int) extends Role

final case class Swatch(role: Role, hex: String, lc: Double):
  def passes(floor: Double): Boolean = math.abs(lc) >= floor

trait Contrast[A]:
  def lc(text: A, surface: A): Double

given Contrast[Swatch] with
  def lc(text: Swatch, surface: Swatch): Double = text.lc - surface.lc

extension (s: Swatch)
  def describe: String = s"${s.role} ${s.hex} (Lc ${"%.1f".format(s.lc)})"

object Report:
  private val Floors: Map[String, Double] = Map("body" -> 90.0, "comment" -> 60.0)

  def label(role: Role): String = role match
    case Error           => "error"
    case Warning         => "warning"
    case Accent(name, 1) => s"$name (primary)"
    case Accent(name, _) => name

  def parse(line: String): Either[String, Swatch] =
    line.split(',').toList match
      case hex :: lc :: Nil =>
        Try(lc.toDouble) match
          case Success(value) => Right(Swatch(Accent("custom", 2), hex, value))
          case Failure(err)   => Left(s"bad Lc in '$line': ${err.getMessage}")
      case _ => Left(s"expected 'hex,lc', got '$line'")

  def summarize(lines: List[String])(using c: Contrast[Swatch]): List[String] =
    for
      line   <- lines
      swatch <- parse(line).toOption
      if swatch.passes(Floors("comment"))
    yield swatch.describe

@main def run(): Unit =
  Report.summarize(List("#2f2a25,95.1", "#8a857c,48.0", "bad")).foreach(println)
