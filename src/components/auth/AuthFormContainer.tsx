interface AuthFormContainerProps {
  children: React.ReactNode;
}

const AuthFormContainer = ({ children }: AuthFormContainerProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer;