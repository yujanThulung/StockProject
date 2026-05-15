const BAR_HEIGHTS = [16, 28, 20, 36, 24];
const BAR_COLORS  = ['#22c55e', '#ef4444', '#22c55e', '#22c55e', '#ef4444'];

const Loader = ({ overlay = false, text = 'Loading...', size = 'md' }) => {
  const barWidth  = size === 'sm' ? 'w-1.5' : size === 'lg' ? 'w-2.5' : 'w-2';
  const gap       = size === 'sm' ? 'gap-1'  : size === 'lg' ? 'gap-2'  : 'gap-1.5';
  const textSize  = size === 'lg' ? 'text-sm' : 'text-xs';
  const padding   = size === 'sm' ? 'py-6' : size === 'lg' ? 'py-20' : 'py-12';

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${overlay ? '' : padding}`}>
      <div className={`flex items-end ${gap}`}>
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`${barWidth} rounded-sm animate-pulse`}
            style={{
              height: h,
              backgroundColor: BAR_COLORS[i],
              animationDelay: `${i * 120}ms`,
              animationDuration: '900ms',
            }}
          />
        ))}
      </div>
      <span className={`${textSize} font-medium text-gray-400 tracking-wide`}>{text}</span>
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl">
        {content}
      </div>
    );
  }

  return <div className="w-full flex items-center justify-center">{content}</div>;
};

export default Loader;
