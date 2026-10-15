#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define SRGB_THRESHOLD 0.04045
#define LUMA(r, g, b) (0.2126 * (r) + 0.7152 * (g) + 0.0722 * (b))

typedef struct {
    double r, g, b;
} rgb_t;

static double linearize(double v) {
    return v <= SRGB_THRESHOLD ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}

/* Parses "#rrggbb" into channels in [0, 1]. Returns 0 on success. */
int parse_hex(const char *hex, rgb_t *out) {
    unsigned int value;
    if (hex == NULL || hex[0] != '#' || sscanf(hex + 1, "%6x", &value) != 1) {
        return -1;
    }
    out->r = ((value >> 16) & 0xFF) / 255.0;
    out->g = ((value >> 8) & 0xFF) / 255.0;
    out->b = (value & 0xFF) / 255.0;
    return 0;
}

double wcag_contrast(const rgb_t *a, const rgb_t *b) {
    double la = LUMA(linearize(a->r), linearize(a->g), linearize(a->b));
    double lb = LUMA(linearize(b->r), linearize(b->g), linearize(b->b));
    double hi = la > lb ? la : lb, lo = la > lb ? lb : la;
    return (hi + 0.05) / (lo + 0.05);
}

int main(int argc, char **argv) {
    rgb_t text, surface;
    if (argc != 3 || parse_hex(argv[1], &text) || parse_hex(argv[2], &surface)) {
        fprintf(stderr, "usage: %s TEXT SURFACE\n", argv[0]);
        return EXIT_FAILURE;
    }
    printf("%.2f:1\n", wcag_contrast(&text, &surface));
    return EXIT_SUCCESS;
}
