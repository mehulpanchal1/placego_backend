// Starter website content. Edit here or later from the admin panel.
module.exports = {
  products: [
    { order: 1, featured: true, name: "PlaceGo DataPulse", tag: "Flagship · Data Platform",
      description: "A ready-to-deploy lakehouse on Azure and Databricks. Connect your sources, apply the medallion architecture and get governed, analytics-ready data in days.",
      features: ["50+ pre-built source connectors", "Bronze, silver and gold layers out of the box", "Unity Catalog governance and lineage", "Cost and pipeline health monitoring"] },
    { order: 2, name: "InsightIQ", tag: "AI Analytics",
      description: "Ask questions about your business in plain English and get charts, answers and summaries grounded in your own data.",
      features: ["Natural-language querying", "Auto-generated KPI dashboards", "Power BI integration"] },
    { order: 3, name: "DocuSense AI", tag: "Document AI",
      description: "Extract structured data from invoices, contracts and forms with field-level confidence and a human review queue.",
      features: ["OCR plus LLM extraction", "Validation and approval workflow", "ERP and API export"] },
    { order: 4, name: "ForecastPro", tag: "Machine Learning",
      description: "Demand and sales forecasting models that retrain automatically and plug into your planning tools.",
      features: ["Store, SKU and region level forecasts", "Automated retraining with MLOps", "What-if scenario planning"] },
    { order: 5, name: "MigrateX", tag: "Modernization",
      description: "A toolkit for moving legacy databases and applications to the cloud with code analysis, mapping and validation.",
      features: ["Legacy code and schema discovery", "Automated data validation", "Zero-downtime cutover plans"] }
  ],
  industries: [
    { order: 1, name: "Banking & Financial Services", icon: "bank", points: ["Fraud detection and risk scoring", "Regulatory reporting automation", "Customer 360 and churn analytics"], segments: "Fintech · NBFC · Insurance" },
    { order: 2, name: "Healthcare & Life Sciences", icon: "heart", points: ["Patient data platforms", "Clinical and claims analytics", "AI-assisted diagnostics support"], segments: "Hospitals · Pharma · Diagnostics" },
    { order: 3, name: "Retail & E-commerce", icon: "cart", points: ["Demand forecasting and inventory", "Personalised recommendations", "Pricing and promotion analytics"], segments: "D2C · Marketplaces · FMCG" },
    { order: 4, name: "Manufacturing", icon: "factory", points: ["Predictive maintenance with IoT", "Quality inspection using vision AI", "Production and OEE dashboards"], segments: "Auto · Textiles · Industrial" },
    { order: 5, name: "Education & EdTech", icon: "edu", points: ["Student performance analytics", "Learning platforms and apps", "Admissions and fee automation"], segments: "Schools · Universities · EdTech" },
    { order: 6, name: "Real Estate & Construction", icon: "building", points: ["Project cost and timeline tracking", "Property and lead management CRM", "Site monitoring dashboards"], segments: "Developers · Brokers · Infra" },
    { order: 7, name: "Logistics & Supply Chain", icon: "truck", points: ["Route and fleet optimisation", "Real-time shipment tracking", "Warehouse analytics"], segments: "3PL · Transport · Distribution" },
    { order: 8, name: "Government & Public Sector", icon: "gov", points: ["Citizen service portals", "Open data and MIS dashboards", "Secure, compliant cloud hosting"], segments: "Departments · Smart cities" }
  ],
  clients: [
    { order: 1, name: "Client One", sector: "Fintech" }, { order: 2, name: "Client Two", sector: "Healthcare" },
    { order: 3, name: "Client Three", sector: "Retail" }, { order: 4, name: "Client Four", sector: "Manufacturing" },
    { order: 5, name: "Client Five", sector: "EdTech" }, { order: 6, name: "Client Six", sector: "Logistics" },
    { order: 7, name: "Client Seven", sector: "Real Estate" }, { order: 8, name: "Client Eight", sector: "Public Sector" }
  ],
  testimonials: [
    { order: 1, quote: "Add a short testimonial from a client here, describing the problem PlaceGo solved and the result.", name: "Client Name", designation: "Designation", company: "Company" },
    { order: 2, quote: "A second testimonial works well when it mentions a measurable outcome, such as time saved or cost reduced.", name: "Client Name", designation: "Designation", company: "Company" },
    { order: 3, quote: "A third testimonial can speak to working style: communication, speed of delivery and support.", name: "Client Name", designation: "Designation", company: "Company" }
  ]
};
