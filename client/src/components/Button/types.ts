interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  color?: string;
  processing?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  overrideStyle?: string;
}

export default ButtonProps;