import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Globe, GraduationCap, User, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const { login } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Load saved credentials if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    const savedRole = localStorage.getItem('remembered_role');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const validateEmail = (value) => {
    if (!value) {
      return i18n.language === 'en' ? 'Email is required' : '邮箱是必填项';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return i18n.language === 'en' ? 'Please enter a valid email address' : '请输入有效的邮箱地址';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return i18n.language === 'en' ? 'Password is required' : '密码是必填项';
    }
    if (value.length < 6) {
      return i18n.language === 'en' ? 'Password must be at least 6 characters' : '密码至少需要6个字符';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError('');
    if (emailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError('');
    if (passwordTouched) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailTouched(true);
    setPasswordTouched(true);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      return;
    }

    setLoading(true);

    try {
      await login(email, password, role);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
        localStorage.setItem('remembered_role', role);
      } else {
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('remembered_role');
      }
      
      navigate(role === 'student' ? '/student' : '/teacher');
    } catch (err) {
      setError(i18n.language === 'en' 
        ? 'Invalid email or password. Please try again.' 
        : '邮箱或密码错误，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Simulate forgot password flow
    alert(i18n.language === 'en' 
      ? 'Password reset link will be sent to your email.' 
      : '密码重置链接将发送到您的邮箱。');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/Artirs/ArtrisStudent.png"
                alt="Artris Logo"
                className="h-20 w-auto"
                onError={(e) => {
                  // Try fallback path
                  if (e.target.src !== '/ArtrisStudent.png') {
                    e.target.src = '/ArtrisStudent.png';
                  } else {
                      e.target.style.display = 'none';
                    }
                }}
              />
            </div>
            <h1 className="text-4xl font-bold text-primary-600 mb-2">Artris</h1>
            <p className="text-gray-600 text-sm">
              {i18n.language === 'en' 
                ? 'Connect with top art mentors worldwide' 
                : '连接全球顶尖艺术导师'}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? '中文' : 'English'}</span>
            </button>
          </div>

          {/* Role Selection */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">{t('auth.loginAsStudent')}</span>
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                role === 'teacher'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">{t('auth.loginAsTeacher')}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  emailError ? 'text-red-400' : email && !emailError ? 'text-green-500' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => {
                    setEmailTouched(true);
                    setEmailError(validateEmail(email));
                  }}
                  className={`input-field pl-10 pr-10 ${
                    emailError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : email && !emailError 
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                        : ''
                  }`}
                  placeholder={i18n.language === 'en' ? 'your@email.com' : 'your@email.com'}
                  required
                />
                {email && !emailError && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {emailError && emailTouched && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('auth.password')}
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {i18n.language === 'en' ? 'Forgot password?' : '忘记密码？'}
                </button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  passwordError ? 'text-red-400' : password && !passwordError ? 'text-green-500' : 'text-gray-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => {
                    setPasswordTouched(true);
                    setPasswordError(validatePassword(password));
                  }}
                  className={`input-field pl-10 pr-10 ${
                    passwordError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : password && !passwordError 
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                        : ''
                  }`}
                  placeholder={i18n.language === 'en' ? 'Enter your password' : '输入您的密码'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && passwordTouched && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                {i18n.language === 'en' ? 'Remember me' : '记住我'}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !!emailError || !!passwordError}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{i18n.language === 'en' ? 'Signing in...' : '登录中...'}</span>
                </>
              ) : (
                <span>{t('auth.login')}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {i18n.language === 'en' ? 'or' : '或'}
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t('auth.register')}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{i18n.language === 'en' ? 'Demo Credentials' : '演示账号'}</span>
            </p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">{i18n.language === 'en' ? 'Email:' : '邮箱：'}</span>{' '}
                <span className="font-mono">demo@artris.com</span>
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">{i18n.language === 'en' ? 'Password:' : '密码：'}</span>{' '}
                <span className="font-mono">demo123</span>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>
                {i18n.language === 'en' 
                  ? 'Your data is encrypted and secure' 
                  : '您的数据已加密并安全'}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
