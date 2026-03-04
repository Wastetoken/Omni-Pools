import { useState, useEffect } from 'react';

type Shape = 'rectangle' | 'circle' | 'kidney';

export const PoolCalculator = () => {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(15);
  const [radius, setRadius] = useState<number>(10);
  const [widthA, setWidthA] = useState<number>(12);
  const [widthB, setWidthB] = useState<number>(18);
  const [shallowDepth, setShallowDepth] = useState<number>(3);
  const [deepDepth, setDeepDepth] = useState<number>(8);
  const [gallons, setGallons] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    calculate();
  }, [shape, length, width, radius, widthA, widthB, shallowDepth, deepDepth]);

  const calculate = () => {
    setError('');
    let vol = 0;
    const avgDepth = (shallowDepth + deepDepth) / 2;

    if (shallowDepth < 0 || deepDepth < 0 || length < 0 || width < 0 || radius < 0 || widthA < 0 || widthB < 0) {
      setError('Values must be positive numbers.');
      setGallons(0);
      return;
    }

    switch (shape) {
      case 'rectangle':
        vol = length * width * avgDepth * 7.5;
        break;
      case 'circle':
        vol = Math.PI * Math.pow(radius, 2) * avgDepth * 7.5;
        break;
      case 'kidney':
        vol = 0.45 * (widthA + widthB) * length * avgDepth * 7.5;
        break;
    }

    setGallons(Math.round(vol));
  };

  const getPricingTier = () => {
    if (gallons === 0) return null;
    if (gallons < 5000) return { range: '$60–$90', tier: 'Small Pool / Spa' };
    if (gallons <= 20000) return { range: '$90–$130', tier: 'Standard Residential' };
    return { range: '$130–$180+', tier: 'Large Residential / Estate' };
  };

  const tier = getPricingTier();

  return (
    <div className="bg-navy-dark p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="block text-foam/60 uppercase tracking-widest text-xs mb-4">Pool Shape</label>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {(['rectangle', 'circle', 'kidney'] as Shape[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                    shape === s ? 'bg-aqua text-navy' : 'bg-white/5 text-foam hover:bg-white/10'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {shape === 'rectangle' && (
              <>
                <div>
                  <label className="block text-foam/60 text-xs mb-2">Length (ft)</label>
                  <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
                </div>
                <div>
                  <label className="block text-foam/60 text-xs mb-2">Width (ft)</label>
                  <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
                </div>
              </>
            )}
            {shape === 'circle' && (
              <div>
                <label className="block text-foam/60 text-xs mb-2">Radius (ft)</label>
                <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
              </div>
            )}
            {shape === 'kidney' && (
              <>
                <div>
                  <label className="block text-foam/60 text-xs mb-2">Length (ft)</label>
                  <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-foam/60 text-xs mb-2">Width A</label>
                    <input type="number" value={widthA} onChange={(e) => setWidthA(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
                  </div>
                  <div>
                    <label className="block text-foam/60 text-xs mb-2">Width B</label>
                    <input type="number" value={widthB} onChange={(e) => setWidthB(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-foam/60 text-xs mb-2">Shallow End (ft)</label>
              <input type="number" value={shallowDepth} onChange={(e) => setShallowDepth(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
            </div>
            <div>
              <label className="block text-foam/60 text-xs mb-2">Deep End (ft)</label>
              <input type="number" value={deepDepth} onChange={(e) => setDeepDepth(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-foam focus:outline-none focus:border-aqua" />
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
          
          <p className="text-foam/40 text-[10px] italic">Formula: {
            shape === 'rectangle' ? 'L × W × avg_depth × 7.5' :
            shape === 'circle' ? 'π × r² × avg_depth × 7.5' :
            '0.45 × (A+B) × length × avg_depth × 7.5'
          }</p>
        </div>

        <div className="flex flex-col justify-center items-center text-center space-y-6 bg-white/5 rounded-2xl p-8 border border-white/10">
          <h4 className="text-foam/60 uppercase tracking-widest text-xs">Estimated Volume</h4>
          <div className="text-6xl md:text-7xl font-black text-aqua tabular-nums">
            {gallons.toLocaleString()}
            <span className="text-xl block mt-2 text-foam/40">Gallons</span>
          </div>
          
          {tier && (
            <div className="space-y-2 pt-6 border-t border-white/10 w-full">
              <p className="text-foam font-bold text-lg">{tier.tier}</p>
              <p className="text-aqua text-2xl font-black">{tier.range}<span className="text-sm text-foam/60 font-normal"> / visit</span></p>
              <p className="text-foam/40 text-xs pt-4">Call for an exact quote based on your specific needs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
