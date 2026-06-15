type StatusAlertProps = {
  variant?: "success" | "error" | "info";
  message: string;
};

export function StatusAlert({
  variant = "info",
  message,
}: StatusAlertProps) {
  return <div className={`status-alert ${variant}`}>{message}</div>;
}