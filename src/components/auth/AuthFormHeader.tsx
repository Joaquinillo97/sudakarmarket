interface AuthFormHeaderProps {
  title: string;
  description: string;
}

const AuthFormHeader = ({ title, description }: AuthFormHeaderProps) => {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold font-magic">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default AuthFormHeader;