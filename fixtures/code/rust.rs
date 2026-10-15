//! Minimal sRGB parsing and luminance, as used by the palette checks.

use std::fmt;
use std::str::FromStr;

/// An sRGB color with channels in 0–1.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Rgb {
    pub r: f64,
    pub g: f64,
    pub b: f64,
}

#[derive(Debug)]
pub enum ParseError {
    MissingHash,
    BadLength(usize),
    BadDigit(char),
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ParseError::MissingHash => write!(f, "expected a leading '#'"),
            ParseError::BadLength(n) => write!(f, "expected 6 hex digits, got {n}"),
            ParseError::BadDigit(c) => write!(f, "invalid hex digit {c:?}"),
        }
    }
}

impl FromStr for Rgb {
    type Err = ParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let digits = s.strip_prefix('#').ok_or(ParseError::MissingHash)?;
        if digits.len() != 6 {
            return Err(ParseError::BadLength(digits.len()));
        }
        let channel = |i: usize| -> Result<f64, ParseError> {
            let pair = &digits[i..i + 2];
            u8::from_str_radix(pair, 16)
                .map(|v| f64::from(v) / 255.0)
                .map_err(|_| ParseError::BadDigit(pair.chars().next().unwrap_or('?')))
        };
        Ok(Rgb { r: channel(0)?, g: channel(2)?, b: channel(4)? })
    }
}

pub trait Luminance {
    fn relative_luminance(&self) -> f64;
}

impl Luminance for Rgb {
    fn relative_luminance(&self) -> f64 {
        let lin = |v: f64| if v <= 0.04045 { v / 12.92 } else { ((v + 0.055) / 1.055).powf(2.4) };
        0.2126 * lin(self.r) + 0.7152 * lin(self.g) + 0.0722 * lin(self.b)
    }
}

fn main() {
    const SAMPLES: [&str; 3] = ["#f9f5ec", "#2f2a25", "oops"];
    for sample in SAMPLES {
        match sample.parse::<Rgb>() {
            Ok(rgb) => println!("{sample}: Y = {:.4}", rgb.relative_luminance()),
            Err(err) => eprintln!("{sample}: {err}"),
        }
    }
}
