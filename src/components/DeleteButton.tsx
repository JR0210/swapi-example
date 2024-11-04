import { Button } from "flowbite-react";

export default function DeleteButton({
  onClick,
  className,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => any;
  className?: string;
}) {
  return (
    <Button data-testid="delete-button" onClick={onClick} className={className}>
      <svg
        className="w-6 h-6 text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18 17.94 6M18 18 6.06 6"
        />
      </svg>
    </Button>
  );
}
