# README overview artwork

The README overview uses the built-in image generation tool for the header diagram only. Its labels and rounded headline metrics were checked against `unified_all_metrics.json`. The microscopy and quantitative panels are copied without resampling from `unified_worldmodel_demo.png`, starting at row 470. The original report figure is retained.

Rebuild on macOS from the repository root:

```sh
swift scripts/compose_readme_overview.swift
```

The compositor verifies every RGB pixel in the saved scientific panels against the original.

## Final correction prompt

The final revision restores both original heading sentences and reduces the title to the original figure's typographic scale using the built-in image generation tool.

```text
Edit this scientific diagram header, making a precise typography correction. Keep the entire diagram (four input boxes, State S box, five output boxes, all arrows, all labels, numerical values, colors) unchanged. Keep wide 3:1 aspect ratio and white background. Replace ONLY the top title/subtitle area. The current title is MUCH too large. Set the main title to a small restrained bold sans-serif size, approximately 30 pixels on a 2172-pixel-wide image (less than HALF current title size), centered at y=40. Main title exact text on ONE line: "Unified Cell-State World Model — one state S fuses expression · space · morphology · time". Restore the missing explanatory sentence on its own centered line at y=135, approximately 26 pixels semibold: "One shared state S predicts all four axes — a single trained network". This sentence MUST appear in full with no omission or paraphrase. Do NOT use current subtitle "One shared state S • expression · space · morphology · time". The two text lines must be modest scientific figure headings, not a poster headline. Keep clear white space between explanatory sentence and diagram. Diagram starts around y=235, below both text lines. No text overlaps, clipping or large title. Preserve every diagram label exactly including R², ρ, +0.30 and all metrics.
```

## Initial image model prompt (superseded typography)

```text
Use case: precise-object-edit / scientific infographic.
Input image is the edit target, a research overview with clipped and overlapping labels. Create ONLY a redesigned upper schematic/header, not the microscopy or plots below it. Output a wide white image aspect ratio about 3:1, at high resolution, polished publication-quality flat diagram, black legible sans-serif typography, generous white margins and padding. It will be composed above the UNCHANGED original scientific photographs and plots.
At top, centered title on its own line: "Unified Cell-State World Model".
Below on its own line, subtitle: "One shared state S • expression · space · morphology · time".
Below subtitle leave generous gap then three-column left-to-right diagram. Four fully closed rounded input boxes at left: "Expression 422" (pale blue), "Spatial GNN" (pale mint), "Morphology DINOv2" (pale cream), "Time (EMT transfer)" (pale coral with dashed red border). All four arrows lead to a central pale yellow rounded box reading "State S" then "(128d)"; fourth input arrow dashed red, others thin gray.
Five separated output boxes in right column with individual gray arrows from State S: "Expression recon R²=0.57" (blue), "Morphology (gain +0.30)" (cream), "Spatial R²=0.33" (mint), "Time trajectory ρ=0.50" (coral), "Sharp image generation" (lavender).
Preserve every label and number above exactly. Layout: title and subtitle exclusively in dedicated header area; diagram entirely below it. No heading crossing boxes, no text overlaps, no cropped borders, no extra labels, no invented scientific images, no legend, no shadows, no watermarks. Input/output arrows may only touch box edges and never cross any text. Output the header and architecture diagram only, NO microscopy or charts.
```
