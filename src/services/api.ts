import {
  DLCProduct,
  User,
  Order,
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  CartItem,
} from "@/types/api";

class ApiService {
  private baseUrl = "https://api.booster-dlc.com/v1";
  private token: string | null = localStorage.getItem("auth_token");

  // Mock data для демонстрации
  private mockDLCs: DLCProduct[] = [
    {
      id: 1,
      title: "Minecraft Dungeons: Hidden Depths",
      description:
        "Исследуйте затопленные подземелья с новыми врагами и артефактами",
      price: 299,
      originalPrice: 499,
      discount: 40,
      image: "🏰",
      category: "Adventure",
      gameId: "minecraft-dungeons",
      platform: ["PC", "Xbox", "PlayStation"],
      rating: 4.7,
      reviewsCount: 1234,
      releaseDate: "2023-09-12",
      features: ["Новые уровни", "Подводная тематика", "Уникальные артефакты"],
      systemRequirements: {
        minimum: "Windows 10, 4GB RAM, DirectX 11",
        recommended: "Windows 11, 8GB RAM, DirectX 12",
      },
      inStock: true,
      downloadSize: "2.1 GB",
    },
    {
      id: 2,
      title: "Cyberpunk 2077: Phantom Liberty",
      description: "Новая история шпионского триллера в Night City",
      price: 1299,
      originalPrice: 1599,
      discount: 19,
      image: "🤖",
      category: "RPG",
      gameId: "cyberpunk-2077",
      platform: ["PC", "Xbox", "PlayStation"],
      rating: 4.9,
      reviewsCount: 5678,
      releaseDate: "2023-09-26",
      features: ["Новый район", "Киану Ривз", "15+ часов контента"],
      systemRequirements: {
        minimum: "Windows 10, 8GB RAM, GTX 1060",
        recommended: "Windows 11, 16GB RAM, RTX 3070",
      },
      inStock: true,
      downloadSize: "18.5 GB",
    },
    {
      id: 3,
      title: "Elden Ring: Shadow of the Erdtree",
      description: "Эпическое дополнение к игре года",
      price: 1799,
      originalPrice: 2199,
      discount: 18,
      image: "⚔️",
      category: "Action",
      gameId: "elden-ring",
      platform: ["PC", "Xbox", "PlayStation"],
      rating: 4.8,
      reviewsCount: 9876,
      releaseDate: "2024-06-21",
      features: ["Новая карта", "Боссы", "Оружие и заклинания"],
      systemRequirements: {
        minimum: "Windows 10, 12GB RAM, GTX 1060",
        recommended: "Windows 11, 16GB RAM, RTX 3060",
      },
      inStock: true,
      downloadSize: "42.3 GB",
    },
  ];

  private mockUser: User = {
    id: "user-123",
    email: "gamer@example.com",
    username: "ProGamer2024",
    avatar: "🎮",
    purchasedDLCs: [],
    balance: 5000,
    createdAt: "2024-01-15T10:30:00Z",
  };

  // Симуляция задержки сети
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Проверка аутентификации
  private isAuthenticated(): boolean {
    return !!this.token;
  }

  // Получение заголовков
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Auth API
  async login(
    credentials: LoginRequest,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay(1000);

    // Mock проверка
    if (
      credentials.email === "admin@booster.com" &&
      credentials.password === "123456"
    ) {
      const token = "mock_jwt_token_" + Date.now();
      this.token = token;
      localStorage.setItem("auth_token", token);

      return {
        success: true,
        data: {
          user: this.mockUser,
          token,
        },
      };
    }

    return {
      success: false,
      data: { user: this.mockUser, token: "" },
      message: "Неверный email или пароль",
    };
  }

  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay(1200);

    const token = "mock_jwt_token_" + Date.now();
    this.token = token;
    localStorage.setItem("auth_token", token);

    const newUser: User = {
      ...this.mockUser,
      email: userData.email,
      username: userData.username,
      id: "user-" + Date.now(),
    };

    return {
      success: true,
      data: {
        user: newUser,
        token,
      },
    };
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (!this.isAuthenticated()) {
      return {
        success: false,
        data: this.mockUser,
        message: "Не авторизован",
      };
    }

    await this.delay(500);

    return {
      success: true,
      data: this.mockUser,
    };
  }

  // DLC API
  async getDLCs(
    category?: string,
    search?: string,
  ): Promise<ApiResponse<DLCProduct[]>> {
    await this.delay(800);

    let filteredDLCs = [...this.mockDLCs];

    if (category && category !== "all") {
      filteredDLCs = filteredDLCs.filter(
        (dlc) => dlc.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search) {
      filteredDLCs = filteredDLCs.filter(
        (dlc) =>
          dlc.title.toLowerCase().includes(search.toLowerCase()) ||
          dlc.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return {
      success: true,
      data: filteredDLCs,
    };
  }

  async getDLCById(id: number): Promise<ApiResponse<DLCProduct>> {
    await this.delay(600);

    const dlc = this.mockDLCs.find((item) => item.id === id);

    if (!dlc) {
      return {
        success: false,
        data: this.mockDLCs[0],
        message: "DLC не найден",
      };
    }

    return {
      success: true,
      data: dlc,
    };
  }

  // Order API
  async createOrder(
    items: CartItem[],
    paymentMethod: string,
  ): Promise<ApiResponse<Order>> {
    if (!this.isAuthenticated()) {
      return {
        success: false,
        data: {} as Order,
        message: "Требуется авторизация",
      };
    }

    await this.delay(1500);

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order: Order = {
      id: "order-" + Date.now(),
      userId: this.mockUser.id,
      items,
      total,
      status: "processing",
      paymentMethod,
      createdAt: new Date().toISOString(),
      keys: {},
    };

    // Симуляция генерации ключей
    items.forEach((item) => {
      if (order.keys) {
        order.keys[item.id.toString()] =
          `${item.gameId.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
    });

    // Симуляция успешной оплаты
    setTimeout(() => {
      order.status = "completed";
    }, 3000);

    return {
      success: true,
      data: order,
    };
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    if (!this.isAuthenticated()) {
      return {
        success: false,
        data: [],
        message: "Требуется авторизация",
      };
    }

    await this.delay(700);

    // Mock orders
    const orders: Order[] = [
      {
        id: "order-123",
        userId: this.mockUser.id,
        items: [this.mockDLCs[0]] as CartItem[],
        total: 299,
        status: "completed",
        paymentMethod: "card",
        createdAt: "2024-01-10T15:30:00Z",
        keys: {
          "1": "MINECRAFT-DLC-ABC123XYZ",
        },
      },
    ];

    return {
      success: true,
      data: orders,
    };
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<string[]>> {
    await this.delay(400);

    const categories = [...new Set(this.mockDLCs.map((dlc) => dlc.category))];

    return {
      success: true,
      data: categories,
    };
  }

  // Search API
  async searchDLCs(query: string): Promise<ApiResponse<DLCProduct[]>> {
    await this.delay(600);

    const results = this.mockDLCs.filter(
      (dlc) =>
        dlc.title.toLowerCase().includes(query.toLowerCase()) ||
        dlc.description.toLowerCase().includes(query.toLowerCase()) ||
        dlc.category.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      success: true,
      data: results,
    };
  }
}

export const apiService = new ApiService();
