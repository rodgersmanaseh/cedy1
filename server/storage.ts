import { articles, comments, newsletters, users, type Article, type InsertArticle, type User, type InsertUser, type Comment, type InsertComment, type Newsletter, type InsertNewsletter } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Articles
  getArticles(limit?: number, offset?: number, category?: string, status?: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementViewCount(id: number): Promise<void>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  
  // Comments
  getCommentsByArticle(articleId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscribers(): Promise<Newsletter[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private comments: Map<number, Comment>;
  private newsletters: Map<number, Newsletter>;
  private currentUserId: number;
  private currentArticleId: number;
  private currentCommentId: number;
  private currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.comments = new Map();
    this.newsletters = new Map();
    this.currentUserId = 1;
    this.currentArticleId = 1;
    this.currentCommentId = 1;
    this.currentNewsletterId = 1;
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "cedarmond2024",
      role: "admin"
    });
    
    // Create sample articles
    this.seedArticles();
  }

  private async seedArticles() {
    const sampleArticles: InsertArticle[] = [
      {
        title: "Parliament Passes Historic Education Reform Bill",
        slug: "parliament-passes-education-reform-bill",
        excerpt: "The National Assembly unanimously approves comprehensive education reforms that will transform Kenya's learning landscape for generations to come.",
        content: "# Parliament Passes Historic Education Reform Bill\n\nIn a historic vote that marks a significant milestone for Kenya's education sector, the National Assembly unanimously approved comprehensive education reforms that promise to transform the country's learning landscape for generations to come.\n\nThe landmark legislation, which has been in development for over two years, introduces sweeping changes to curriculum delivery, teacher training standards, and infrastructure development across all levels of education from primary to tertiary institutions.\n\n## Key Provisions of the Reform\n\nAmong the most significant changes introduced by the bill is the mandatory integration of digital literacy programs starting from primary school level. This initiative aims to bridge the digital divide and ensure that all Kenyan students are equipped with essential technology skills needed for the modern workforce.\n\nThe reforms also establish new minimum standards for teacher qualification and introduce continuous professional development requirements that will see educators receive regular training updates to keep pace with evolving educational methodologies and technologies.",
        category: "politics",
        author: "Sarah Kimani",
        featuredImage: "https://images.unsplash.com/photo-1580902394724-b08ff9ba7e8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        tags: ["education", "politics", "parliament", "reform"],
        status: "published",
        readTime: 5
      },
      {
        title: "Harambee Stars Qualify for AFCON 2024 After Dramatic Victory",
        slug: "harambee-stars-qualify-afcon-2024",
        excerpt: "Kenya's national football team secured their spot in the Africa Cup of Nations with a thrilling 2-1 victory over their rivals in Nairobi.",
        content: "# Harambee Stars Qualify for AFCON 2024\n\nKenya's national football team, Harambee Stars, has officially qualified for the 2024 Africa Cup of Nations following a dramatic 2-1 victory at Kasarani Stadium in Nairobi.\n\nThe match was a nail-biting affair that kept fans on the edge of their seats until the final whistle. Goals from Michael Olunga and Masoud Juma secured the crucial victory that Kenya needed to book their place in the continental showpiece.\n\n## Match Highlights\n\nThe first half saw both teams create numerous chances, but it was Kenya who broke the deadlock in the 38th minute through a well-worked team move finished by Olunga.\n\nThe visitors equalized just before halftime, setting up a tense second half where both teams pushed for the winning goal that would determine their AFCON fate.",
        category: "football",
        author: "Peter Otieno",
        featuredImage: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        tags: ["football", "harambee stars", "afcon", "sports"],
        status: "published",
        readTime: 4
      },
      {
        title: "Kenya's Tech Hubs Leading Africa's Digital Revolution",
        slug: "kenya-tech-hubs-digital-revolution",
        excerpt: "From Silicon Savannah to iHub, Kenya's technology ecosystem continues to foster innovation and entrepreneurship across the continent.",
        content: "# Kenya's Tech Hubs Leading Africa's Digital Revolution\n\nKenya has emerged as a leading technology hub in Africa, with innovations emanating from Nairobi's Silicon Savannah reaching global audiences and transforming lives across the continent.\n\n## The Rise of Silicon Savannah\n\nNairobi's technology ecosystem has grown exponentially over the past decade, with numerous tech hubs, incubators, and accelerators supporting startups and established companies alike.\n\niHub, one of the pioneering tech hubs in Africa, has been instrumental in nurturing local talent and providing a platform for innovation. The hub has supported over 400 startups and created thousands of jobs in the technology sector.\n\n## Innovation Across Sectors\n\nKenyan tech companies are making significant impacts across various sectors:\n\n- **Fintech**: M-Pesa revolutionized mobile money globally\n- **Agritech**: Solutions helping farmers optimize crop yields\n- **Healthtech**: Digital health platforms improving access to healthcare\n- **Edtech**: Educational technologies transforming learning experiences",
        category: "education",
        author: "James Mwangi",
        featuredImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        tags: ["technology", "startups", "innovation", "silicon savannah"],
        status: "published",
        readTime: 7
      },
      {
        title: "Lupita Nyong'o Wins International Film Award",
        slug: "lupita-nyongo-wins-international-film-award",
        excerpt: "Kenyan-born actress Lupita Nyong'o continues to make Kenya proud on the international stage with her latest achievement in cinema.",
        content: "# Lupita Nyong'o Wins International Film Award\n\nKenyan-born actress Lupita Nyong'o has once again brought pride to Kenya by winning the prestigious International Film Award for her outstanding performance in her latest film project.\n\nThe Academy Award-winning actress has consistently represented Kenya on the global stage, and this latest recognition further solidifies her position as one of Africa's most celebrated talents in the entertainment industry.\n\n## A Career of Excellence\n\nSince her breakthrough role in '12 Years a Slave,' Lupita has continued to choose diverse and meaningful projects that showcase her range as an actress while also highlighting important social issues.\n\nHer dedication to her craft and her commitment to using her platform for positive change continues to inspire young Kenyans and Africans worldwide.",
        category: "entertainment",
        author: "Grace Wanjiku",
        featuredImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        tags: ["entertainment", "lupita nyongo", "film", "kenya"],
        status: "published",
        readTime: 3
      },
      {
        title: "Kenyan Celebrity Chef Opens New Restaurant in Nairobi",
        slug: "kenyan-celebrity-chef-opens-restaurant-nairobi",
        excerpt: "Award-winning chef brings authentic Kenyan cuisine to new heights with the opening of an innovative restaurant in the heart of Nairobi.",
        content: "# Kenyan Celebrity Chef Opens New Restaurant in Nairobi\n\nRenowned Kenyan chef has opened a new upscale restaurant in Nairobi's central business district, featuring a unique blend of traditional Kenyan flavors with modern culinary techniques.\n\nThe restaurant, which opened its doors last weekend, has already attracted food enthusiasts and celebrities alike, with its innovative approach to East African cuisine.\n\n## Celebrating Kenyan Flavors\n\nThe menu features reimagined versions of classic Kenyan dishes, using locally sourced ingredients and contemporary presentation styles. From elevated ugali preparations to gourmet nyama choma, the restaurant offers a fresh perspective on familiar flavors.\n\nThe chef's commitment to supporting local farmers and suppliers has also been praised, as the restaurant sources 90% of its ingredients from Kenyan producers.",
        category: "gossip",
        author: "Mary Njeri",
        featuredImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        tags: ["celebrity", "food", "restaurant", "nairobi"],
        status: "published",
        readTime: 4
      },
      {
        title: "New Digital Learning Platform Launched for Kenyan Students",
        slug: "digital-learning-platform-kenyan-students",
        excerpt: "Revolutionary online education platform aims to provide quality learning resources to students across Kenya, bridging the urban-rural education gap.",
        content: "# New Digital Learning Platform Launched for Kenyan Students\n\nA groundbreaking digital learning platform has been launched to provide comprehensive educational resources to students across Kenya, with a particular focus on bridging the gap between urban and rural educational opportunities.\n\nThe platform, developed in partnership with leading Kenyan universities and international technology companies, offers courses aligned with the Kenyan curriculum from primary through tertiary levels.\n\n## Features and Accessibility\n\nThe platform includes interactive lessons, virtual laboratories, and assessment tools designed to work even on basic smartphones and with limited internet connectivity. This ensures that students in remote areas can access quality educational content.\n\nTeachers across the country have already begun integrating the platform into their lesson plans, with training workshops being conducted in all 47 counties.\n\n## Impact on Education\n\nEarly adoption rates have exceeded expectations, with over 50,000 students registering in the first month. The platform is expected to play a crucial role in supporting Kenya's education goals and preparing students for the digital economy.",
        category: "education",
        author: "Dr. Joseph Kariuki",
        featuredImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        tags: ["education", "digital learning", "technology", "students"],
        status: "published",
        readTime: 6
      }
    ];

    for (const article of sampleArticles) {
      await this.createArticle(article);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "admin",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getArticles(limit = 20, offset = 0, category?: string, status = "published"): Promise<Article[]> {
    let filteredArticles = Array.from(this.articles.values())
      .filter(article => article.status === status);
    
    if (category && category !== "all") {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    return filteredArticles
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(offset, offset + limit);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = {
      ...insertArticle,
      id,
      status: insertArticle.status || "draft",
      featuredImage: insertArticle.featuredImage || null,
      tags: insertArticle.tags || null,
      readTime: insertArticle.readTime || 5,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date()
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  async incrementViewCount(id: number): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.viewCount++;
      this.articles.set(id, article);
    }
  }

  async getFeaturedArticles(limit = 3): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.status === "published")
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.status === "published" &&
        (article.title.toLowerCase().includes(searchTerm) ||
         article.excerpt.toLowerCase().includes(searchTerm) ||
         article.content.toLowerCase().includes(searchTerm) ||
         article.tags?.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
  }

  async getCommentsByArticle(articleId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.articleId === articleId && comment.approved)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      approved: false,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    return comment;
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const existing = Array.from(this.newsletters.values())
      .find(sub => sub.email === insertNewsletter.email);
    
    if (existing) {
      existing.subscribed = true;
      return existing;
    }
    
    const id = this.currentNewsletterId++;
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      subscribed: true,
      createdAt: new Date()
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values())
      .filter(sub => sub.subscribed);
  }
}

export const storage = new MemStorage();
