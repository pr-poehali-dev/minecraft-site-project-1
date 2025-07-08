import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import Icon from "@/components/ui/icon";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login, register, loading, error } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginForm);
    if (success) {
      onClose();
      setLoginForm({ email: "", password: "" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(registerForm);
    if (success) {
      onClose();
      setRegisterForm({ email: "", username: "", password: "" });
    }
  };

  const handleDemoLogin = async () => {
    const success = await login({
      email: "admin@booster.com",
      password: "123456",
    });
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#2ECC71] text-center text-xl">
            🎮 Вход в BOOSTER DLC
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-black"
            >
              Вход
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-black"
            >
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="gamer@example.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm flex items-center">
                  <Icon name="AlertCircle" size={16} className="mr-2" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-black font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Icon
                    name="Loader2"
                    size={16}
                    className="mr-2 animate-spin"
                  />
                ) : (
                  <Icon name="LogIn" size={16} className="mr-2" />
                )}
                Войти
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">или</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-black"
              disabled={loading}
            >
              <Icon name="Play" size={16} className="mr-2" />
              Демо-вход (admin@booster.com / 123456)
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="gamer@example.com"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-username">Никнейм</Label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="ProGamer2024"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      username: e.target.value,
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm flex items-center">
                  <Icon name="AlertCircle" size={16} className="mr-2" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-black font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Icon
                    name="Loader2"
                    size={16}
                    className="mr-2 animate-spin"
                  />
                ) : (
                  <Icon name="UserPlus" size={16} className="mr-2" />
                )}
                Создать аккаунт
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
