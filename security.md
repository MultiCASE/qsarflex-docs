# Security

---

## Data Processing

**Web App:** Compound structures and evaluation requests are transmitted to MultiCASE servers over HTTPS for processing. Results are returned to your browser session.

**Desktop — Local:** All compound structures and QSAR model inference run entirely on your device. No compound data leaves your machine. The Local variant requires no internet connection after installation.

**Desktop — Cloud:** Connects to MultiCASE's cloud infrastructure. Compound data is transmitted over HTTPS to MultiCASE servers for evaluation.

---

## Authentication

QSAR Flex uses [Amazon Cognito](https://aws.amazon.com/cognito/) for identity management. User credentials are never stored by the application — authentication is handled entirely by Cognito's hosted identity service.

---

## Third-Party APIs

Some features optionally call external APIs:

| Feature | Service | Data Sent |
|---|---|---|
| Autofill | PubChem REST API | Compound name, CAS, or SMILES |
| DataKurator PubChem Lookup | PubChem REST API | Compound SMILES |

PubChem calls are opt-in. Review [PubChem's terms of use](https://www.ncbi.nlm.nih.gov/home/about/policies/) for their data handling policies.

---

## Contact

For security inquiries: [support@multicase.com](mailto:support@multicase.com)
