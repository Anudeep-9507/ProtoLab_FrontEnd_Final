import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'],
  animationSpeed = 5
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')}, ${colors[0]})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <div className={`animated-gradient-text ${className}`}>
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}