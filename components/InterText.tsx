import { Text, TextProps } from 'react-native';
import { ReactNode } from 'react';

interface InterTextProps extends TextProps {
  className?: string; // Allow Tailwind classes
  children: ReactNode; // Ensure valid children
}

const InterText: React.FC<InterTextProps> = ({ className, style, children, ...props }) => {
  return (
    <Text className={`font-sans text-base ${className}`} style={style} {...props}>
      {children}
    </Text>
  );
};

export default InterText;
