using System.Text.Json;
using ChemiGraphy.Embedded;
using com.epam.indigo;

// molart <art.json> <outdir> [ink]
//
// art.json: [{ "name", "smiles", "w", "h", "marks": [{ "smarts", "color" }] }]
//
// Indigo reads the SMILES and lays the molecule out; ChemiGraphy draws it from
// the resulting molfile, so the atom numbering the marks refer to is the one in
// the drawing. Marks are SMARTS matched against the same molecule.
if (args.Length < 2) { Console.Error.WriteLine("molart <art.json> <outdir> [ink]"); return 2; }
var ink = args.Length > 2 ? args[2] : "#141414";
var spec = JsonSerializer.Deserialize<List<Item>>(File.ReadAllText(args[0]),
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
Directory.CreateDirectory(args[1]);
var indigo = new Indigo();
var failed = 0;
foreach (var item in spec)
{
    var mol = indigo.loadMolecule(item.Smiles);
    mol.dearomatize();
    mol.layout();
    var molfile = mol.molfile();
    var groups = new List<(IReadOnlyCollection<int> Atoms, string Color)>();
    foreach (var m in item.Marks ?? new())
    {
        var query = indigo.loadSmarts(m.Smarts);
        var atoms = new HashSet<int>();
        foreach (IndigoObject match in indigo.substructureMatcher(mol).iterateMatches(query))
            foreach (IndigoObject qa in query.iterateAtoms())
                if (match.mapAtom(qa) is { } target) atoms.Add(target.index());
        if (atoms.Count == 0) Console.Error.WriteLine($"{item.Name}: {m.Smarts} matched nothing");
        groups.Add((atoms, m.Color));
    }
    var svg = groups.Count == 0
        ? StructureDepiction.FromMolfile(molfile, item.W, item.H)
        : StructureDepiction.FromMolfile(molfile, groups, item.W, item.H);
    if (svg is null) { Console.Error.WriteLine($"{item.Name}: ChemiGraphy could not draw it"); failed++; continue; }
    // The box only sizes the stroke rule; the file's own size follows the drawing,
    // so a host that sets a width gets the drawing's aspect ratio, not the box's.
    var vb = System.Text.RegularExpressions.Regex.Match(svg, "viewBox=\"[^\"]* [^\"]* ([^\" ]+) ([^\"]+)\"");
    if (vb.Success)
        svg = new System.Text.RegularExpressions.Regex("width=\"\\d+\" height=\"\\d+\"")
            .Replace(svg, $"width=\"{vb.Groups[1].Value}\" height=\"{vb.Groups[2].Value}\"", 1);
    svg = svg.Replace("#000000", ink)
             .Replace("font-family=\"Helvetica, Arial, sans-serif\"", "font-family=\"Helvetica Neue, Helvetica, Arial, sans-serif\"");
    File.WriteAllText(Path.Combine(args[1], item.Name + ".svg"), svg);
    Console.WriteLine($"{item.Name}.svg  {groups.Sum(g => g.Atoms.Count)} marked atoms");
}
return failed == 0 ? 0 : 1;

record Mark(string Smarts, string Color);
record Item(string Name, string Smiles, int W, int H, List<Mark>? Marks);
