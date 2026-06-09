# Folder Structure of the Repo

- `data/`
    - [`categories.ts`](../data/categories.ts)
        - Contains the centralized navigation configuration.
        - Exports `serviceCategories` (includes routing, sub-items, and Lucide React icons) and `headerDropdown` for the main navbar.
    - `services/` TODO: Move the categories to services folder
        - The dedicated directory for all government service data, split logically by category for easy maintenance and scaling without merge conflicts.
        - [`index.ts`](../data/services/index.ts)
            - The "barrel file". Imports all individual JSON category files and merges them into a single `allServices` array for the React components to consume.
        - [`business.json`](../data/services/business.json)
            - Contains the array of services related to Business, Trade, and Investment.
        - [`certificates.json`](../data/services/certificates.json)
            - Contains the array of services related to Certificates and Vital Records.
        - [`health.json`](../data/services/health.json)
            - Contains the array of services related to Health and Wellness.
        - [`infrastructure.json`](../data/services/infrastructure.json)
            - Contains the array of services related to Infrastructure and Public Works.
        - [`transport.json`](../data/services/transport.json)
            - Contains the array of services related to Transport and Driving.
