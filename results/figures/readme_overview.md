# README overview artwork

The README overview uses the built-in image generation tool for the header diagram only. Its labels and rounded headline metrics were checked against `unified_all_metrics.json`. The microscopy and quantitative panels are copied without resampling from `unified_worldmodel_demo.png`, starting at row 470. The original report figure is retained.

Rebuild on macOS from the repository root:

```sh
swift scripts/compose_readme_overview.swift
```

The compositor verifies every RGB pixel in the saved scientific panels against the original.

## Image model prompt

```text
Use case: precise-object-edit / scientific infographic.
Input image is the edit target, a research overview with clipped and overlapping labels. Create ONLY a redesigned upper schematic/header, not the microscopy or plots below it. Output a wide white image aspect ratio about 3:1, at high resolution, polished publication-quality flat diagram, black legible sans-serif typography, generous white margins and padding. It will be composed above the UNCHANGED original scientific photographs and plots.
At top, centered title on its own line: "Unified Cell-State World Model".
Below on its own line, subtitle: "One shared state S • expression · space · morphology · time".
Below subtitle leave generous gap then three-column left-to-right diagram. Four fully closed rounded input boxes at left: "Expression 422" (pale blue), "Spatial GNN" (pale mint), "Morphology DINOv2" (pale cream), "Time (EMT transfer)" (pale coral with dashed red border). All four arrows lead to a central pale yellow rounded box reading "State S" then "(128d)"; fourth input arrow dashed red, others thin gray.
Five separated output boxes in right column with individual gray arrows from State S: "Expression recon R²=0.57" (blue), "Morphology (gain +0.30)" (cream), "Spatial R²=0.33" (mint), "Time trajectory ρ=0.50" (coral), "Sharp image generation" (lavender).
Preserve every label and number above exactly. Layout: title and subtitle exclusively in dedicated header area; diagram entirely below it. No heading crossing boxes, no text overlaps, no cropped borders, no extra labels, no invented scientific images, no legend, no shadows, no watermarks. Input/output arrows may only touch box edges and never cross any text. Output the header and architecture diagram only, NO microscopy or charts.
```
