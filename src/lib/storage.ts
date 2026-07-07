import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // dir already exists
  }
}

async function readJson<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filepath, "utf-8");
    return JSON.parse(content) as T[];
  } catch {
    return [];
  }
}

async function writeJson<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  newsletterConsent: boolean;
  verified: boolean;
  otpCode?: string;
  otpExpires?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export const storage = {
  async getCustomers(): Promise<Customer[]> {
    return readJson<Customer>("customers.json");
  },
  async addCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers();
    customers.push(customer);
    await writeJson("customers.json", customers);
  },
  async findCustomerByEmail(email: string): Promise<Customer | undefined> {
    const customers = await this.getCustomers();
    return customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  },
  async findCustomerById(id: string): Promise<Customer | undefined> {
    const customers = await this.getCustomers();
    return customers.find((c) => c.id === id);
  },
  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | undefined> {
    const customers = await this.getCustomers();
    const idx = customers.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    customers[idx] = { ...customers[idx], ...updates };
    await writeJson("customers.json", customers);
    return customers[idx];
  },

  async getReviews(): Promise<Review[]> {
    return readJson<Review>("reviews.json");
  },
  async getApprovedReviews(): Promise<Review[]> {
    const reviews = await this.getReviews();
    return reviews.filter((r) => r.approved);
  },
  async addReview(review: Review): Promise<void> {
    const reviews = await this.getReviews();
    reviews.push(review);
    await writeJson("reviews.json", reviews);
  },

  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    return readJson<NewsletterSubscriber>("newsletter.json");
  },
  async addSubscriber(sub: NewsletterSubscriber): Promise<void> {
    const subs = await this.getSubscribers();
    if (!subs.find((s) => s.email.toLowerCase() === sub.email.toLowerCase())) {
      subs.push(sub);
      await writeJson("newsletter.json", subs);
    }
  },
};
