// winid.swift — print "id x y w h" (points) of the frontmost on-screen window
// matching an owner name and/or a title substring. Empty args match anything.
// Build: swiftc winid.swift -o winid   ·   Use: ./winid Seqtara "Data Files"
import CoreGraphics
import Foundation

let a = CommandLine.arguments
let owner = a.count > 1 ? a[1] : ""
let titleSub = a.count > 2 ? a[2] : ""

let opts = CGWindowListOption(arrayLiteral: .optionOnScreenOnly, .excludeDesktopElements)
guard let list = CGWindowListCopyWindowInfo(opts, kCGNullWindowID) as? [[String: Any]] else { exit(1) }

for w in list {
    let o = w[kCGWindowOwnerName as String] as? String ?? ""
    let n = w[kCGWindowName as String] as? String ?? ""
    let num = w[kCGWindowNumber as String] as? Int ?? 0
    let alpha = w[kCGWindowAlpha as String] as? Double ?? 1
    if alpha < 0.1 { continue }
    if !owner.isEmpty && o != owner { continue }
    if !titleSub.isEmpty && !n.contains(titleSub) { continue }
    var x = 0.0, y = 0.0, ww = 0.0, hh = 0.0
    if let b = w[kCGWindowBounds as String] as? [String: Any] {
        x = b["X"] as? Double ?? 0; y = b["Y"] as? Double ?? 0
        ww = b["Width"] as? Double ?? 0; hh = b["Height"] as? Double ?? 0
    }
    print("\(num) \(Int(x)) \(Int(y)) \(Int(ww)) \(Int(hh))")
    exit(0)
}
exit(1)
