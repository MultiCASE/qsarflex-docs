# Security

🔒 This page describes how QSAR Flex handles your data — where it is processed, what leaves your machine, and which third-party services are involved.

---

## Data Processing by Variant

**🌐 Web App**

Compound structures and evaluation requests are transmitted to MultiCASE servers over HTTPS for processing. Results are returned to your browser session. No compound data is stored by MultiCASE beyond the scope of your active session.

**💻 Desktop — Local**

QSAR model inference runs entirely on your device. Compound structures are not sent to MultiCASE servers for evaluation — the models and data are bundled with the application. Internet is still required for:
- **License verification** — your license is checked against MultiCASE's licensing service at launch and periodically during use
- **Authentication** — sign-in is handled by Amazon Cognito (hosted identity service)
- **Optional PubChem lookups** — only when you explicitly trigger Autofill or DataKurator PubChem features

**☁️ Desktop — Cloud**

Filter models are installed locally and QSAR inference runs entirely on your device — compound structures are not sent to MultiCASE servers for evaluation. The reference database (used by the N-Nitrosation and Oral Bioavailability modules) is queried over HTTPS from MultiCASE's cloud database. Internet is required throughout use for license verification, authentication, and database access.

---

## Authentication

QSAR Flex uses [Amazon Cognito](https://aws.amazon.com/cognito/) for identity management. User credentials are never stored by the application — authentication is handled entirely by Cognito's hosted identity service at `auth.multicase.com`.

Session tokens are managed by Cognito and are not accessible to or stored by the QSAR Flex application code.

---

## Third-Party APIs

Some features optionally call external APIs. These calls are only made when you explicitly trigger the relevant feature:

| Feature | Service | Data Sent | When |
|---|---|---|---|
| **Autofill** (Library) | PubChem REST API | Compound name, CAS, or SMILES | When you click Auto Fill in the Add Compound dialog |
| **DataKurator — PubChem Batch Correct** | PubChem REST API | Compound SMILES | When you click PubChem Batch Correct and confirm the warning |
| **DataKurator — PubChem lookup** (single row) | PubChem REST API | Compound SMILES | When you select PubChem lookup from a row's ⋮ menu |

> ⚠️ PubChem calls send compound SMILES to `pubchem.ncbi.nlm.nih.gov`. MultiCASE does **not** store or log the data sent to PubChem. Review [PubChem's terms of use](https://www.ncbi.nlm.nih.gov/home/about/policies/) before using these features.

All PubChem features show an explicit confirmation dialog before sending any data.

---

## Data Retention

MultiCASE does not store your compound structures or evaluation inputs on its servers beyond what is necessary to return results to your session. For questions about data retention policies, contact [support@multicase.com](mailto:support@multicase.com).

---

## Contact

For security inquiries or to report a vulnerability: [support@multicase.com](mailto:support@multicase.com)
