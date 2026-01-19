---
layout: project
tags: project
title: Grid Typography Generator
summary: A combinatorial system that generates all possible variations of a modular typographic grid by treating visual segments as binary states.
student: Wouter Pollaris
project_year: 2025
project_type: Generative design system
tech_stack: Python, SVG, Adobe Illustrator
coaching: Code Space
thumbnail: /static/projects/2025-grid-typography-generator-wouter-pollaris/variations-grid.png
---

## The Concept

Wouter Pollaris developed a system to explore the complete possibility space of a modular typographic grid. The core idea: decompose a visual grid into discrete segments, then generate every possible combination of those segments being present or absent.

Rather than manually designing variations or randomly sampling, this approach exhaustively enumerates all 2^n configurations. For 28 segments, that yields 268,435,456 unique compositions—a complete atlas of what the grid can become.

![Nine variations from the generator showing different segment combinations](/static/projects/2025-grid-typography-generator-wouter-pollaris/variations-grid.png)

## System Overview

The system operates on three levels:

1. **Segment Library** — Individual SVG files, each containing one geometric element (a bar, line, or corner piece) positioned on a shared coordinate system
2. **Alternate Segments** — Special segments that replace combinations when certain elements appear together (handling visual collisions)
3. **Generator** — A Python script that iterates through all binary combinations and assembles valid SVGs

The segments were designed in Adobe Illustrator and exported as individual SVG files. Each file contains a single `<rect>` or `<polygon>` element positioned within a 510×510 pixel canvas.

## Core Mechanisms

### Segment Structure

Each segment file follows a naming convention that encodes its identity and relationships:

| Pattern          | Meaning                                         |
| ---------------- | ----------------------------------------------- |
| `grid-N.svg`     | Base segment N                                  |
| `grid-N+M.svg`   | Alternate for when segments N and M both appear |
| `grid-N+M+P.svg` | Alternate for three-segment combination         |

![Individual segments from the library](/static/projects/2025-grid-typography-generator-wouter-pollaris/segments-index.png)

A base segment is a simple rectangular bar:

**Base segment (grid-1.svg)**

```xml
<g id="Laag_1">
  <rect x="28.346" y="28.346" width="240.945" height="28.346"/>
</g>
```

An alternate segment replaces colliding elements with a merged form:

**Alternate segment (grid-1+9.svg)**

```xml
<g id="Laag_1">
  <!-- Merged corner shape instead of two overlapping bars -->
  <polygon points="269.291,28.346 269.291,56.686 36.641,56.686
                   28.351,48.396 28.351,28.346"/>
</g>
```

### Binary Enumeration

The generator treats each segment as a bit in a 28-bit integer. Segment 1 maps to bit 0, segment 2 to bit 1, and so on. This allows iteration through all combinations using a simple counter:

**Bit extraction logic**

```python
segment_count = 28
possible_combinations = int(math.pow(2, segment_count))

for i in range(0, possible_combinations):
    segment_ids = []
    for j in range(0, 28):
        # Extract bit j from number i
        if (i >> j) & 1 == 1:
            segment_ids.append(j + 1)
```

When `i = 100` (binary: `1100100`), segments 3, 6, and 7 are active. When `i = 255` (binary: `11111111`), segments 1–8 are active.

### Collision Resolution

When certain segments appear together, they would overlap visually. The system detects these cases and substitutes a merged alternate:

**Alternate detection and substitution**

```python
# Build set of known alternates from filenames like "grid-1+9.svg"
alternate_segment_set = set([find_segment_list(f) for f in alternate_files])

# Check all 3-segment combinations in current selection
for combo in itertools.combinations(segment_ids, 3):
    if combo in alternate_segment_set:
        # Replace lowest-numbered segment with the combined form
        lowest_segment_id = combo[0]
        idx = segment_ids.index(lowest_segment_id)
        segment_ids[idx] = combo  # Now a tuple, handled specially

# Same for 2-segment combinations
for combo in itertools.combinations(segment_ids, 2):
    if combo in alternate_segment_set:
        lowest_segment_id = combo[0]
        idx = segment_ids.index(lowest_segment_id)
        segment_ids[idx] = combo
```

The substitution replaces the lowest-numbered segment ID with a tuple representing the combined form. During assembly, tuples trigger loading the alternate file.

### SVG Assembly

Each output is assembled by concatenating segment content into a single SVG:

**Output generation**

```python
SVG_HEADER = '<svg xmlns="http://www.w3.org/2000/svg" ' \
             'width="524.409px" height="524.409" viewBox="0 0 524.409 524.409">'
SVG_FOOTER = "</svg>"

svg = SVG_HEADER
for segment_id in segment_ids:
    if isinstance(segment_id, tuple):
        # Alternate segment: join IDs with "+"
        ids = "+".join([str(sid) for sid in segment_id])
        segment_file = f"segments/grid-{ids}.svg"
    else:
        segment_file = f"segments/grid-{segment_id}.svg"

    segment = read_segment(segment_file)
    svg += segment

svg += SVG_FOOTER
```

The `read_segment` function extracts the inner content from each segment file, stripping the XML declaration and outer `<svg>` wrapper:

**Segment extraction**

```python
def read_segment(file):
    with open(file) as fp:
        xml = fp.read()
        # Remove namespace to avoid duplication
        xml = xml.replace('xmlns="http://www.w3.org/2000/svg"', "")

    root = ET.fromstring(xml)
    first_child = list(root)[1]  # Skip empty <g id="back">
    return ET.tostring(first_child, encoding="unicode")
```

## Output Structure

The generator produces 1,024 SVG files (the project was run with a reduced segment count for iteration):

```
out/
├── out-0.svg      # Empty (no segments active)
├── out-1.svg      # Only segment 1
├── out-2.svg      # Only segment 2
├── out-3.svg      # Segments 1 and 2
├── out-255.svg    # Segments 1–8 (outer frame)
├── out-511.svg    # Segments 1–9
└── out-1023.svg   # Segments 1–10
```

Each filename encodes its binary configuration. `out-255.svg` (binary `11111111`) produces the complete outer frame:

![Output 255: the eight outer frame segments](/static/projects/2025-grid-typography-generator-wouter-pollaris/example-octant.png)

## Technical Notes

**Coordinate system**: All segments share a 510.236×510.236 point canvas (Adobe Illustrator's default). The output canvas is slightly larger (524.409) to accommodate margins.

**Rotation handling**: Many segments use SVG transform matrices for rotation. The system preserves these transforms during extraction:

```xml
<rect x="347.244" y="134.646"
      transform="matrix(6.123234e-17 -1 1 6.123234e-17 318.8976 616.5355)"
      width="240.945" height="28.346"/>
```

**Scalability**: With 28 segments, full generation produces 268 million files. The project uses `tqdm` for progress indication during long runs.

**File naming**: The `find_segment_list` function parses filenames to extract segment relationships:

```python
def find_segment_list(file):
    # 'segments/grid-1+10.svg' → (1, 10)
    file = os.path.basename(file)           # grid-1+10.svg
    file = os.path.splitext(file)[0]        # grid-1+10
    file = file.split("-")[1]               # 1+10
    file = file.split("+")                  # ['1', '10']
    file = [int(f) for f in file]           # [1, 10]
    return tuple(file)                      # (1, 10)
```

## Working Method

1. **Design segments** in Illustrator on a shared artboard
2. **Export each segment** as a separate SVG with consistent naming
3. **Identify collision pairs** where segments overlap and design merged alternates
4. **Name alternates** using the `N+M` convention
5. **Run generator** to produce all combinations
6. **Review outputs** to identify missing alternates or visual issues
7. **Iterate** by adding new alternates as needed

The alternate system allows progressive refinement: start with base segments, run generation, identify problems, add alternates, repeat.

## Outcome

The system produces a complete catalog of grid configurations that can be:

- Browsed visually to discover unexpected compositions
- Filtered programmatically based on segment count or specific combinations
- Used as source material for animation (interpolating between configurations)
- Extended with additional segment layers

The binary encoding means any configuration can be recalled by its index number, and relationships between configurations are mathematically explicit (adjacent numbers differ by one segment).

---

_Wouter Pollaris conceived and designed this typographic exploration system. Code Space provided technical coaching on the combinatorial generation approach and SVG manipulation._
