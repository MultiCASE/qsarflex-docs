# Evaluation

Run licensed prediction modules against all compounds in your library with one click.

---

## Starting an Evaluation

With at least one compound in the Library, click the green **Evaluate** button in the toolbar (or press **⌘K** / **Ctrl+K**).

The module selection dialog opens and lists all modules available under your license.

![](.gitbook/assets/evaluate-dialog-light.png)

Select one or more modules and click **Evaluate**. QSARFlex evaluates every compound in the library against every selected module simultaneously.

---

## Results

After evaluation, results appear in the Library table — one column per selected module.

![](.gitbook/assets/eval-results-light.png)

Each cell shows the outcome for that compound and module. Possible values depend on the module (e.g., Active/Inactive, a numeric prediction, or a category label).

---

## Module Reports

Click any result cell to generate a detailed HTML report for that compound and module. The report opens in-app and includes:

- Prediction outcome and confidence
- Structural alerts and contributing fragments
- Supporting evidence and model metadata

---

## Supported Modules

Available modules depend on your license. Common examples:

| Module | Endpoint |
|---|---|
| Ames Mutagenicity | Genotoxicity (Ames test) |
| CPCA Prediction | N-nitrosamine carcinogenic potency (NDSRIs) |
| Surrogate Search | N-nitrosamine surrogate lookup |
| Cross Similarity | Structural similarity matrix across the library |
| Water Solubility | Aqueous solubility prediction |
| Tetrahymena 48h GC50 | Aquatic ecotoxicity |
| Soil Adsorption | Environmental persistence |

See the full [Model Catalog](fundamentals/model-catalog.md) for all available endpoints.

---

## Tips

- Run evaluation multiple times with different module selections — results accumulate in the table.
- On the Desktop app, evaluation runs fully offline — no internet connection required.
- **Cross Similarity** generates an NxN similarity matrix and is best used with ≥2 compounds.
