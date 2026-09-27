// Run from the repository root: swift scripts/compose_readme_overview.swift
// The image model supplies only the schematic. Scientific panels are copied
// pixel-for-pixel from the original figure, without resampling or redrawing.
import AppKit

func read(_ path: String) throws -> NSBitmapImageRep {
    let data = try Data(contentsOf: URL(fileURLWithPath: path))
    guard let image = NSBitmapImageRep(data: data) else { fatalError("Invalid image: \(path)") }
    return image
}
let base = "results/figures/"
let source = try read(base + "unified_worldmodel_demo.png")
let header = try read(base + "readme_overview_header.png")
let width = source.pixelsWide
let headerHeight = Int((Double(header.pixelsHigh) * Double(width) / Double(header.pixelsWide)).rounded())
let panelStart = 470
let height = headerHeight + source.pixelsHigh - panelStart
let output = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height,
    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
    colorSpaceName: .deviceRGB, bytesPerRow: width * 4, bitsPerPixel: 32)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: output)
NSColor.white.setFill()
NSRect(x: 0, y: 0, width: width, height: height).fill()
NSGraphicsContext.current!.imageInterpolation = .high
header.draw(in: NSRect(x: 0, y: height - headerHeight, width: width, height: headerHeight))
NSGraphicsContext.restoreGraphicsState()
var pixel = [Int](repeating: 0, count: 4)
var actual = pixel
for y in panelStart..<source.pixelsHigh {
    for x in 0..<width {
        source.getPixel(&pixel, atX: x, y: y)
        if source.samplesPerPixel == 3 { pixel[3] = 255 }
        output.setPixel(&pixel, atX: x, y: headerHeight + y - panelStart)
    }
}
let path = base + "readme_worldmodel_overview.png"
try output.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
let saved = try read(path)
for y in panelStart..<source.pixelsHigh {
    for x in 0..<width {
        source.getPixel(&pixel, atX: x, y: y)
        saved.getPixel(&actual, atX: x, y: headerHeight + y - panelStart)
        precondition(pixel.prefix(3) == actual.prefix(3), "Scientific panel changed")
    }
}
print("Saved \(path) (\(width) × \(height)); all scientific panel RGB pixels match the original.")
