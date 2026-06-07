export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number; // USD
  image: string;
  fileUrl: string;
  category?: string;
}

export const products: Product[] = [
  {
    id: 1,
    slug: "starter-react-template",
    title: "Starter React + Vite Template",
    description:
      "A minimal, well-documented React + Vite starter with TypeScript and Tailwind.",
    price: 9,
    image: "/products/placeholder-1.svg",
    fileUrl: "/products/product-1.txt",
    category: "Templates",
  },
  {
    id: 2,
    slug: "tailwind-landing-kit",
    title: "Tailwind Landing Kit",
    description:
      "A set of ready-to-use landing sections and components built with Tailwind.",
    price: 7,
    image: "/products/placeholder-2.svg",
    fileUrl: "/products/product-2.txt",
    category: "Templates",
  },
  {
    id: 3,
    slug: "cheatsheet-markdown",
    title: "Markdown Cheatsheet (PDF)",
    description: "A compact Markdown reference and tips PDF for quick writing.",
    price: 3,
    image: "/products/placeholder-1.svg",
    fileUrl: "/products/product-2.txt",
    category: "Guides",
  },
  {
    id: 4,
    slug: "data-sample-csv",
    title: "Sample CSV Dataset",
    description: "Curated sample data for demos and testing (CSV).",
    price: 5,
    image: "/products/placeholder-2.svg",
    fileUrl: "/products/product-1.txt",
    category: "Data",
  },
  {
    id: 5,
    slug: "ui-kit-tailwind",
    title: "UI Kit (Tailwind)",
    description: "A compact collection of UI components and snippets.",
    price: 8,
    image: "/products/placeholder-1.svg",
    fileUrl: "/products/product-1.txt",
    category: "Templates",
  },
  {
    id: 6,
    slug: "automation-scripts",
    title: "Automation Scripts Bundle",
    description: "Useful automation and utility scripts (Bash/Node).",
    price: 6,
    image: "/products/placeholder-2.svg",
    fileUrl: "/products/product-2.txt",
    category: "Scripts",
  },
  {
    id: 7,
    slug: "vscode-snippets",
    title: "VSCode Snippets Pack",
    description: "A pack of productivity snippets for common workflows.",
    price: 4,
    image: "/products/placeholder-1.svg",
    fileUrl: "/products/product-1.txt",
    category: "Plugins",
  },
  {
    id: 8,
    slug: "landing-starter",
    title: "Landing Starter Kit",
    description: "Complete landing page starter with hero, features, CTAs.",
    price: 10,
    image: "/products/placeholder-2.svg",
    fileUrl: "/products/product-2.txt",
    category: "Templates",
  },
];

export default products;
