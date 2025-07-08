import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { AuthModal } from "@/components/AuthModal";
import { DLCProduct, CartItem } from "@/types/api";
import { apiService } from "@/services/api";
import { AuthContext, useAuthState } from "@/hooks/useAuth";

const Index = () => {
  const authState = useAuthState();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dlcProducts, setDlcProducts] = useState<DLCProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dlcsResponse, categoriesResponse] = await Promise.all([
        apiService.getDLCs(selectedCategory, searchQuery),
        apiService.getCategories(),
      ]);

      if (dlcsResponse.success) {
        setDlcProducts(dlcsResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(["all", ...categoriesResponse.data]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: DLCProduct) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!authState.isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    setProcessingOrder(true);
    try {
      const response = await apiService.createOrder(cart, "card");
      if (response.success) {
        alert("Заказ успешно оформлен! Ключи отправлены на ваш email.");
        setCart([]);
        setCartOpen(false);
      } else {
        alert("Ошибка при оформлении заказа: " + response.message);
      }
    } catch (error) {
      alert("Ошибка сети при оформлении заказа");
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <AuthContext.Provider value={authState}>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-[#2ECC71] font-mono tracking-wider">
                BOOSTER DLC
              </div>
              <Badge variant="secondary" className="bg-[#2ECC71] text-black">
                BETA
              </Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="hover:text-[#2ECC71] transition-colors">
                Главная
              </a>
              <a
                href="#catalog"
                className="hover:text-[#2ECC71] transition-colors"
              >
                Каталог
              </a>
              <a href="#" className="hover:text-[#2ECC71] transition-colors">
                О нас
              </a>
              <a href="#" className="hover:text-[#2ECC71] transition-colors">
                Поддержка
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              {authState.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="text-gray-400">Привет, </span>
                    <span className="text-[#2ECC71] font-semibold">
                      {authState.user?.username}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={authState.logout}
                    className="text-gray-400 hover:text-white"
                  >
                    <Icon name="LogOut" size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-black"
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Войти
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setCartOpen(!cartOpen)}
                className="relative border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-black"
              >
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2ECC71] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="container mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#2ECC71] to-white bg-clip-text text-transparent font-mono">
                BOOSTER DLC
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Лучшие игровые дополнения по супер ценам. Ускорь свой гейминг с
                премиум DLC!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="bg-[#2ECC71] hover:bg-[#27AE60] text-black font-semibold px-8 py-3 text-lg">
                <Icon name="Zap" size={20} className="mr-2" />
                Посмотреть каталог
              </Button>
              <Button
                variant="outline"
                className="border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-black px-8 py-3 text-lg"
              >
                <Icon name="Play" size={20} className="mr-2" />
                Как это работает
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <Icon
                  name="Zap"
                  size={48}
                  className="text-[#2ECC71] mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Мгновенная доставка
                </h3>
                <p className="text-gray-400">
                  Получите ключи сразу после оплаты
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <Icon
                  name="Shield"
                  size={48}
                  className="text-[#2ECC71] mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">100% гарантия</h3>
                <p className="text-gray-400">
                  Все ключи официальные и проверенные
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <Icon
                  name="Percent"
                  size={48}
                  className="text-[#2ECC71] mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Лучшие цены</h3>
                <p className="text-gray-400">Скидки до 80% на популярные DLC</p>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('/img/61dbeb4f-d2c8-4f92-b2fe-577fb73c34d2.jpg')] bg-cover bg-center opacity-10"></div>
        </section>
        {/* Catalog Section */}
        <section id="catalog" className="py-16 px-4 bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#2ECC71]">
                🎮 Популярные DLC
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Откройте новые миры и возможности с нашими премиум дополнениями
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dlcProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-gray-800 border-gray-700 hover:border-[#2ECC71] transition-all hover:scale-105 group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2">{product.image}</div>
                      <Badge className="bg-red-600 text-white">
                        {product.discount}
                      </Badge>
                    </div>
                    <CardTitle className="text-[#2ECC71] group-hover:text-white transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {product.description}
                    </CardDescription>
                    <Badge
                      variant="outline"
                      className="w-fit border-[#2ECC71] text-[#2ECC71]"
                    >
                      {product.category}
                    </Badge>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-[#2ECC71]">
                        {product.price}
                      </span>
                      <span className="text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-black font-semibold"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />В
                      корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cart Sidebar */}
        {cartOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setCartOpen(false)}
          >
            <div
              className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2ECC71]">Корзина</h3>
                <Button variant="ghost" onClick={() => setCartOpen(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Icon
                    name="ShoppingCart"
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">
                              {item.title}
                            </div>
                            <div className="text-[#2ECC71] font-bold">
                              {item.price}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-xl font-bold text-[#2ECC71]">
                        {getTotalPrice()}₽
                      </span>
                    </div>

                    <Button className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-black font-semibold mb-2">
                      <Icon name="CreditCard" size={16} className="mr-2" />
                      Оформить заказ
                    </Button>

                    <div className="text-xs text-gray-400 text-center">
                      <Icon name="Shield" size={12} className="inline mr-1" />
                      Безопасная оплата
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Payment Info Section */}
        <section className="py-16 px-4 bg-black border-t border-gray-800">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-[#2ECC71]">
                💳 Способы оплаты
              </h2>
              <p className="text-gray-400">
                Выберите удобный для вас способ оплаты
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
                <Icon
                  name="CreditCard"
                  size={32}
                  className="text-[#2ECC71] mx-auto mb-2"
                />
                <div className="font-semibold">Банковская карта</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
                <Icon
                  name="Smartphone"
                  size={32}
                  className="text-[#2ECC71] mx-auto mb-2"
                />
                <div className="font-semibold">СБП</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
                <Icon
                  name="Wallet"
                  size={32}
                  className="text-[#2ECC71] mx-auto mb-2"
                />
                <div className="font-semibold">ЮMoney</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">₿</div>
                <div className="font-semibold">Криптовалюты</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
          <div className="container mx-auto text-center">
            <div className="text-2xl font-bold text-[#2ECC71] mb-4">
              BOOSTER DLC
            </div>
            <p className="text-gray-400 mb-4">
              Ускорь свой гейминг с лучшими DLC
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-[#2ECC71] transition-colors"
              >
                <Icon name="MessageCircle" size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#2ECC71] transition-colors"
              >
                <Icon name="Send" size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#2ECC71] transition-colors"
              >
                <Icon name="Youtube" size={20} />
              </a>
            </div>
          </div>
        </footer>

        {/* Auth Modal */}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </AuthContext.Provider>
  );
};

export default Index;
