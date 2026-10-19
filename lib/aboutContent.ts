/**
 * Content for /about.
 *
 * Sourced from "Bluetron Infotech Profile.pdf" (public/) — the company's own
 * 14-page profile deck — plus the capability list supplied by the business.
 * Keep this file plain data: no JSX, no imports, so it stays framework-free.
 */

export interface Capability {
  id: string;
  index: string;
  title: string;
  spec: string;
  lede: string;
  detail: string[];
}

/**
 * The eleven service areas, in the order the homepage presents them. The
 * spec, lede and details are the business's own capability list.
 */
export const CAPABILITIES: Capability[] = [
  {
    id: "it-infrastructure",
    index: "01",
    title: "IT Infrastructure",
    spec: "Desktops, Laptops, Workstations, Servers & Storage",
    lede: "We design, deploy and manage infrastructure that delivers performance, scalability and security as the business grows.",
    detail: [
      "Rack, tower and blade servers for enterprise applications",
      "Scalable, secure storage for data availability and protection",
      "Server virtualization and cloud-ready infrastructure",
      "Laptops, desktops, workstations and peripherals",
      "Flexible IT rentals for short-term and project-based needs",
    ],
  },
  {
    id: "networking",
    index: "02",
    title: "Enterprise Networking",
    spec: "LAN, WAN, Wi-Fi & Structured Cabling",
    lede: "Secure, high-performance networks that keep sites, people and systems connected, from campus to cloud.",
    detail: [
      "Switching, routing and campus networking",
      "Structured cabling and passive infrastructure",
      "Wi-Fi 6 / 6E / 7 for high-density environments",
      "Multi-site WAN and SD-WAN connectivity",
      "Monitoring, configuration and lifecycle management",
    ],
  },
  {
    id: "data-center",
    index: "03",
    title: "Data Center & Cloud",
    spec: "Design, Build, Compute & Disaster Recovery",
    lede: "Building, modernizing and managing resilient data center environments that drive operational efficiency.",
    detail: [
      "Data center design and build",
      "Compute, storage and virtualization platforms",
      "High availability and disaster recovery",
      "Energy-efficient infrastructure",
      "Backup, replication and business continuity planning",
    ],
  },
  {
    id: "cybersecurity",
    index: "04",
    title: "Cybersecurity",
    spec: "Firewall, Endpoint & Network Security Solutions",
    lede: "Protecting what matters most: secure operations, regulatory compliance and continuity in an evolving threat landscape.",
    detail: [
      "Next-gen firewalls, IDS / IPS and network segmentation",
      "Endpoint protection, anti-ransomware and threat response",
      "Identity and access management, MFA, PAM and Zero Trust",
      "Compliance, audit support and vulnerability assessment",
      "Managed security services (SOC / SIEM) and risk advisory",
    ],
  },
  {
    id: "audio-visual",
    index: "05",
    title: "Audio-Visual & Collaboration",
    spec: "Smart Meeting Rooms, Signage & Interactive Displays",
    lede: "Collaboration environments that enable seamless communication and smarter workplaces.",
    detail: [
      "Video conferencing and room systems for leading platforms",
      "End-to-end smart meeting rooms with control and automation",
      "Digital signage and interactive kiosks",
      "Conference audio, ceiling microphones and PA systems",
      "Interactive flat panels for training and smart classrooms",
    ],
  },
  {
    id: "surveillance",
    index: "06",
    title: "Surveillance & Security",
    spec: "Monitoring, Intrusion Detection & Integrated Security",
    lede: "End-to-end surveillance that helps you monitor, protect and manage people, assets and premises.",
    detail: [
      "IP and analog cameras with AI-based video analytics",
      "Video management systems and centralized monitoring",
      "Biometric, RFID and card-based access control",
      "Intrusion detection, alarm management and real-time alerts",
      "Perimeter security, licence plate recognition and barrier integration",
    ],
  },
  {
    id: "products",
    index: "07",
    title: "End-User Computing",
    spec: "Procurement, Supply & Pan-India Delivery",
    lede: "A structured approach to sourcing the right products: genuine brands, competitive pricing, dependable delivery.",
    detail: [
      "Printers and multifunction devices",
      "Cartridges, toners, ink and paper",
      "Monitors, keyboards, mice, headsets and webcams",
      "Docking stations, adapters and cabling",
      "Understand, recommend, configure, procure, support",
    ],
  },
  {
    id: "cloud-software",
    index: "08",
    title: "Software & Licensing",
    spec: "OEM Software, Licensing Advisory & Compliance",
    lede: "Acquiring, managing and optimizing licences with the right OEM partnerships and ongoing compliance support.",
    detail: [
      "Operating systems and volume licensing",
      "Microsoft 365, productivity and collaboration suites",
      "Server, database and virtualization software",
      "Hybrid cloud, workload migration and managed services",
      "Licence assessment, audit readiness and renewal management",
    ],
  },
  {
    id: "power",
    index: "09",
    title: "Power Backup",
    spec: "Continuity, Power Management & Efficiency",
    lede: "Reliable power that keeps operations running without interruption, with efficiency built in.",
    detail: [
      "Online and line-interactive UPS, rack and tower formats",
      "Power distribution units, ATS and voltage stabilizers",
      "Battery solutions: SLA, lithium-ion and battery management",
      "Energy audits, smart monitoring and solar integration",
      "Predictive maintenance, AMC and 24x7 technical assistance",
    ],
  },
  {
    id: "managed-services",
    index: "10",
    title: "Managed IT Services",
    spec: "AMC, FMS & Remote Monitoring",
    lede: "Proactive, cost-effective managed services that keep the estate running smoothly, anytime, anywhere.",
    detail: [
      "24x7 infrastructure monitoring with dedicated NOC support",
      "Comprehensive AMC for hardware and software",
      "Preventive maintenance and regular health checks",
      "Facility management services and asset management",
      "Vendor coordination, compliance and reporting",
    ],
  },
  {
    id: "support",
    index: "11",
    title: "Installation, Integration & Technical Support",
    spec: "Commissioning, Break-Fix & On-Site Engineers",
    lede: "Skilled engineers who install, integrate and support the systems we supply, from commissioning through to daily operations.",
    detail: [
      "Skilled L1 / L2 / L3 on-site engineers",
      "Installation, configuration and commissioning",
      "Break-fix and troubleshooting",
      "Multi-vendor systems integration",
      "User support, training and flexible engagement models",
    ],
  },
];

/** Customer segments the business serves. */
export const SECTORS = [
  {
    id: "corporate",
    name: "Corporate",
    note: "Multi-location rollouts, standardized estates and predictable support.",
  },
  {
    id: "government",
    name: "Government",
    note: "Compliant procurement, documented delivery and long-term serviceability.",
  },
  {
    id: "psu",
    name: "PSU",
    note: "Large-scale tenders, structured commissioning and maintenance contracts.",
  },
  {
    id: "education",
    name: "Education",
    note: "Smart classrooms, campus networks and shared computing at scale.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    note: "Data center, security and collaboration programmes end to end.",
  },
];

/** How an engagement runs, start to finish. */
export const LIFECYCLE = [
  {
    step: "01",
    title: "Consultation",
    note: "Understand the business requirement before proposing anything.",
  },
  {
    step: "02",
    title: "Design",
    note: "Architect the right solution around that requirement.",
  },
  {
    step: "03",
    title: "Supply",
    note: "Source genuine products through trusted OEM partnerships.",
  },
  {
    step: "04",
    title: "Implementation",
    note: "Install and integrate with qualified engineers.",
  },
  {
    step: "05",
    title: "Commissioning",
    note: "Test, hand over and document the working system.",
  },
  {
    step: "06",
    title: "Post-Sales Support",
    note: "Maintain, monitor and extend equipment life.",
  },
];

/**
 * The three words the company leads with.
 *
 * `facets` is not new information: each one is the list the note already
 * contains, lifted out so it can be set as a list instead of read as a
 * sentence. Nothing is claimed here that the note does not claim.
 */
export const PILLARS = [
  {
    word: "Technology",
    note: "Multi-technology expertise across infrastructure, networks, security and collaboration.",
    facets: ["Infrastructure", "Networks", "Security", "Collaboration"],
  },
  {
    word: "Reliability",
    note: "Quality products, professional execution and systems that stay up.",
    facets: ["Quality products", "Professional execution", "Systems that stay up"],
  },
  {
    word: "Commitment",
    note: "Responsive support and a long-term partnership, not a one-off transaction.",
    facets: ["Responsive support", "Long-term partnership"],
  },
];

/** Working principles, from the profile deck. */
export const PRINCIPLES = [
  "Client Focused",
  "Quality Driven",
  "Innovation Led",
  "Long-Term Partnership",
];

/** OEM and technology partners named in the profile deck. */
export const PARTNERS = ["Microsoft", "Adobe", "VMware", "Veeam", "Red Hat", "Oracle"];
