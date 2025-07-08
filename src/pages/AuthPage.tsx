import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import AuthLoadingSpinner from "@/components/auth/AuthLoadingSpinner";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";

type AuthFormType = 'login' | 'signup' | 'forgot-password' | 'password-reset';

const AuthPage = () => {
  const [formType, setFormType] = useState<AuthFormType>('login');

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("AuthPage rendered", { isAuthenticated, authLoading });

  // Check for password reset in URL hash (Supabase recovery flow)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.substring(1));
    
    // Check for traditional reset parameter
    if (urlParams.get('reset') === 'true') {
      setFormType('password-reset');
    }
    
    // Check for Supabase recovery tokens in hash
    if (hashParams.get('type') === 'recovery' && hashParams.get('access_token')) {
      console.log('Recovery tokens detected in URL hash');
      setFormType('password-reset');
      
      // Process the recovery session automatically
      const processRecoverySession = async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting recovery session:', error);
          } else if (session) {
            console.log('Recovery session established successfully');
          }
        } catch (error) {
          console.error('Error processing recovery session:', error);
        }
      };
      
      processRecoverySession();
    }
  }, [location.search, location.hash]);

  // If we're already authenticated, redirect to the home page
  // or to the page the user was trying to access before authentication
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting");
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  // Show a global loading state if the auth system is still initializing
  if (authLoading) {
    return <AuthLoadingSpinner />;
  }

  // If we're already authenticated but still on this page, redirect
  if (isAuthenticated) {
    return null; // Return null while the useEffect handles redirection
  }

  // Get form title and description based on current form type
  const getFormContent = () => {
    switch (formType) {
      case 'signup':
        return {
          title: "Crear cuenta",
          description: "Regístrate para acceder a todas las funcionalidades"
        };
      case 'forgot-password':
        return {
          title: "Recuperar contraseña",
          description: "Ingresa tu correo electrónico para recuperar tu contraseña"
        };
      case 'password-reset':
        return {
          title: "Nueva contraseña",
          description: "Ingresa tu nueva contraseña"
        };
      default:
        return {
          title: "Iniciar sesión",
          description: "Ingresa tus credenciales para acceder a tu cuenta"
        };
    }
  };

  const renderForm = () => {
    switch (formType) {
      case 'signup':
        return (
          <SignUpForm 
            onSwitchToLogin={() => setFormType('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onBackToLogin={() => setFormType('login')}
          />
        );
      case 'password-reset':
        return <PasswordResetForm />;
      default:
        return (
          <LoginForm 
            onSwitchToSignUp={() => setFormType('signup')}
            onSwitchToForgotPassword={() => setFormType('forgot-password')}
          />
        );
    }
  };

  const { title, description } = getFormContent();

  return (
    <AuthFormContainer>
      <AuthFormHeader title={title} description={description} />
      {renderForm()}
    </AuthFormContainer>
  );
};

export default AuthPage;