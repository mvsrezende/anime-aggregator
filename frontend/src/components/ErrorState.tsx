type ErrorStateProps = {
  message?: string;
};

export function ErrorState({ message = "Ocorreu um erro ao carregar os dados." }: ErrorStateProps) {
  return <div className="feedback error">{message}</div>;
}