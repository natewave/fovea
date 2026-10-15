# frozen_string_literal: true

require "json"

module Fovea
  # A named color with its contrast against the background.
  Swatch = Struct.new(:role, :hex, :lc, keyword_init: true) do
    def passes?(floor) = lc.abs >= floor
  end

  class Palette
    include Enumerable

    FLOORS = { body: 90, comment: 60, decorative: 15 }.freeze

    attr_reader :name

    def initialize(name, swatches = [])
      @name = name
      @swatches = swatches
    end

    def each(&block)
      @swatches.each(&block)
    end

    def failures(kind = :body)
      floor = FLOORS.fetch(kind) { raise ArgumentError, "unknown kind: #{kind}" }
      reject { |swatch| swatch.passes?(floor) }.map(&:role)
    end

    def to_json(*args)
      { name: @name, swatches: map(&:to_h) }.to_json(*args)
    end
  end
end

palette = Fovea::Palette.new("Fovea Day", [Fovea::Swatch.new(role: :fg, hex: "#2f2a25", lc: 95.1)])
puts palette.failures.empty? ? "All body text passes" : "Failures: #{palette.failures.join(', ')}"
puts palette.to_json if ENV.key?("VERBOSE")
