---
description: >-
  This provides a high-level overview of all commercial models available for
  licensing.Use this catalog to:
cover: ../../.gitbook/assets/Screenshot 2025-09-15 at 1.04.57 PM.png
coverY: 0
---

# QSAR Flex Model Catalog

* Explore available endpoints and their associated models.
* Decide which endpoints to include in your license configuration.
* Quickly confirm whether a model is part of your current license.

***

#### How to Use This Catalog <a href="#how-to-use-this-catalog" id="how-to-use-this-catalog"></a>

* Scroll through the catalog below or select an endpoint of interest through the Quick Navigation section

#### **Quick Navigation** <a href="#quick-navigation" id="quick-navigation"></a>

* [N-Nitrosamine Evaluation Tools](qsar-flex-model-catalog.md#n-nitrosamine-evaluation-tools)
* [Ecotoxicity Models](qsar-flex-model-catalog.md#ecotoxicity-models)
* [Physicochemical Properties](qsar-flex-model-catalog.md#physicochemical-properties)

## N-Nitrosamine Evaluation Tools

Evaluate potential carcinogenicity potency.

<table data-header-hidden><thead><tr><th>ID</th><th width="369.4453125">Description</th><th>Records</th></tr></thead><tbody><tr><td>CPCA Prediction</td><td><p>Carcinogenicity Potency Categorization Approach (CPCA) for</p><p>N-Nitrosamines</p></td><td>Surrogates= 209 NDSRIs with AI= 540</td></tr><tr><td>* Surrogate Search</td><td><p>Analog-based read across using nitrosamine local</p><p>environment similarity measure</p></td><td>194</td></tr><tr><td>N-Nitrosation Tool</td><td><p>Nitrosation assessment for both individual compound and</p><p>synthetic route</p></td><td>1,238</td></tr></tbody></table>

​View Full Data Sheet ↓

{% file src="../../.gitbook/assets/QF_MODEL_DATA_N-Nitrosamines_version_3.3.pdf" %}

\
These modules are designed to evaluate the potential carcinogenic potency of N-nitrosamine

compounds that have not undergone adequate animal carcinogenicity testing. The primary

module for this purpose is the CPCA Prediction module, which is designed for assigning N-

nitrosamine impurities (including NDSRIs) to a predicted carcinogenic potency category and a

corresponding acceptable intake (AI) limit. This module also performs sophisticated surrogate

(with animal carcinogenicity data) search and finding similar NDSRIs for which regulatory

agencies have published acceptable limits (AIs).



The Surrogate Search module is the legacy module to search for N-Nitrosamine surrogates with

available animal carcinogenicity data. This module was introduced few years before the

introduction of the CPCA method. It is accompanied by additional modules such as LogP, water

solubility, Ames mutagenicity, and the Gold Carcinogenicity Potency Database (CPDB).\
\
\* Only available as a model within the QSAR Flex local installation. While the Surrogate Search model is currently unavailable within the QSAR Flex Web App we would encourage customers to make use of the CPCA surrogate feature for now.

## Ecotoxicity Models

Evaluate various characteristics of adverse impact on the natural environment.

<table data-header-hidden><thead><tr><th>ID</th><th width="418.87109375">Description</th><th>Records</th></tr></thead><tbody><tr><td>Fathead Minnow 96h LC50</td><td>Acute toxicity to Pimephales promelas (96 hrs. of exposure)</td><td>920</td></tr><tr><td>Daphnia 48h LC50</td><td>Acute toxicity to Daphnia magna (48 hrs. of exposure)</td><td>2124</td></tr><tr><td>Tetrahymena 48h GC50</td><td>Acute toxicity to Tetrahymena pyriformis (48 hrs. of exposure)</td><td>1898</td></tr><tr><td>Algae 72h EC50</td><td>Acute toxicity to various algae (72 hrs. of exposure)</td><td>1377</td></tr><tr><td>Bio Concentration Factor</td><td><p>Ratio of concentration of contaminant in organism to surrounding</p><p>water</p></td><td>563</td></tr><tr><td>Ready Biodegradability</td><td><p>Aerobic biodegradation potential of a chemical substance within</p><p>28 days, as per OECD Test 301</p></td><td>1443</td></tr><tr><td>Soil Adsorption</td><td>The organic carbon-sorption coefficient (Koc)</td><td>651</td></tr></tbody></table>

​View Full Data Sheet ↓

{% file src="../../.gitbook/assets/QF_MODEL_DATA_ECOTOX.pdf" %}

Ecotoxicity refers to the adverse impact of chemicals on the natural environment, including plants, animals, and microorganisms. It involves effects on population growth, reproduction, and overall health of organisms, as well as the consequences on ecosystems and the benefits they provide. The ecotoxicity of a chemical can be influenced by its physical and chemical characteristics, its ability to persist in the environment and its capacity to bioaccumulate.

## Physicochemical Properties

Evaluate critical components of a chemicals Physchem characteristics

<table data-header-hidden><thead><tr><th>ID</th><th width="362.39453125">Description</th><th>Records</th></tr></thead><tbody><tr><td>LogP</td><td>Octanol-water partition coefficient</td><td>12645</td></tr><tr><td>Water Solubility</td><td>Water Solubility at 25°C</td><td>3800</td></tr><tr><td>Vapor Pressure</td><td>Vapor Pressure at 25°C</td><td>1829</td></tr><tr><td>Boiling Point</td><td>Boiling Points of organic compounds</td><td>4890</td></tr></tbody></table>

​View Full Data Sheet ↓

{% file src="../../.gitbook/assets/QF_MODEL_DATA_PHYSCHEM.pdf" %}

Intrinsic physical and chemical characteristics, such as appearance, boiling point, density, volatility, water solubility, and flammability, are known as physicochemical properties of a substance.

Incorporating information about a compound's physicochemical properties into a QSAR model can enhance the model's ability in predicting the compound's toxicity. This is because these properties influence the compound's interactions with other molecules and its ability to enter and exit cells, which ultimately impacts its toxicity. As a result, these properties are commonly used as descriptors in modeling ecotoxicity, ADME properties, and other toxic properties.
