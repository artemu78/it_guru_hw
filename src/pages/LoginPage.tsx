import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const loginSchema = z.object({
  username: z.string().min(1, 'Логин обязателен'),
  password: z.string().min(1, 'Пароль обязателен'),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      username: 'emilys', // DummyJSON test user
      password: 'emilyspassword',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          expiresInMins: 30,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка авторизации');
      }

      setUser(result, data.rememberMe);
      navigate('/products');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f6f6] flex items-center justify-center p-4">
      <div className="bg-white max-w-[492px] w-full rounded-[40px] shadow-[0px_24px_32px_0px_rgba(0,0,0,0.04)] overflow-hidden p-[6px]">
        <div className="bg-gradient-to-b from-[rgba(35,35,35,0.03)] to-[rgba(35,35,35,0)] border border-[#ededed] rounded-[34px] p-[48px] flex flex-col items-center gap-[32px]">
          {/* Logo Placeholder */}
          <div className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-[0px_0px_0px_2px_white,0px_12px_8px_0px_rgba(0,0,0,0.03)] border border-[#ededed]">
             <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rotate-45" />
             </div>
          </div>

          <div className="text-center flex flex-col gap-[12px]">
            <h1 className="text-[40px] font-semibold text-[#232323] leading-[1.1] tracking-[-0.6px]">
              Добро пожаловать!
            </h1>
            <p className="text-[18px] font-medium text-[#e0e0e0] leading-[1.5]">
              Пожалуйста, авторизируйтесь
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit as any)} className="w-full flex flex-col gap-[20px]"> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
            <div className="flex flex-col gap-[16px]">
              {/* Login Field */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[18px] font-medium text-[#232323] tracking-[-0.27px]">
                  Логин
                </label>
                <div className={cn(
                  "bg-white border-[1.5px] border-[#ededed] rounded-[12px] flex items-center gap-[14px] px-[16px] py-[14px]",
                  errors.username && "border-red-500"
                )}>
                  <User className="w-6 h-6 text-grey-medium" />
                  <input
                    {...register('username')}
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-[18px] font-medium text-[#232323]"
                    placeholder="Введите логин"
                  />
                </div>
                {errors.username && (
                  <span className="text-red-500 text-sm">{errors.username.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[18px] font-medium text-[#232323] tracking-[-0.27px]">
                  Пароль
                </label>
                <div className={cn(
                  "bg-white border-[1.5px] border-[#ededed] rounded-[12px] flex items-center gap-[14px] px-[16px] py-[14px]",
                  errors.password && "border-red-500"
                )}>
                  <Lock className="w-6 h-6 text-grey-medium" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="flex-1 bg-transparent border-none outline-none text-[18px] font-medium text-[#232323]"
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-0 bg-transparent hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6 text-grey-medium" />
                    ) : (
                      <Eye className="w-6 h-6 text-grey-medium" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div 
              className="flex items-center gap-[10px] cursor-pointer"
              onClick={() => setValue('rememberMe', !rememberMe)}
            >
              {rememberMe ? (
                <CheckSquare className="w-6 h-6 text-primary fill-primary/10" />
              ) : (
                <Square className="w-6 h-6 text-[#9c9c9c]" />
              )}
              <span className="text-[16px] font-medium text-[#9c9c9c]">
                Запомнить данные
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col gap-[16px] w-full">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[58px] bg-primary rounded-[12px] text-white text-[18px] font-semibold flex items-center justify-center shadow-[0px_8px_8px_0px_rgba(54,122,255,0.03),inset_0px_-2px_0px_1px_rgba(0,0,0,0.08)] hover:bg-[#1d26c0] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Загрузка...' : 'Войти'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-[10px] w-full">
                <div className="h-[1px] flex-1 bg-grey-light" />
                <span className="text-[16px] font-medium text-[#ebebeb]">или</span>
                <div className="h-[1px] flex-1 bg-grey-light" />
              </div>
            </div>
          </form>

          <p className="text-[18px] text-[#6c6c6c]">
            Нет аккаунта?{' '}
            <span className="text-primary font-semibold underline decoration-solid cursor-pointer">
              Создать
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
