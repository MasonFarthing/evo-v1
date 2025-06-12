export default function OptionsPage() {
  return (
    <div className="p-8 min-h-screen bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-brand bg-clip-text text-transparent">
        Options & Settings
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-blue/20 rounded-lg p-6">
          <h3 className="text-xl mb-3 font-medium">Theme Preferences</h3>
          <p className="text-white/70">Coming soon...</p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-blue/20 rounded-lg p-6">
          <h3 className="text-xl mb-3 font-medium">Account Settings</h3>
          <p className="text-white/70">Coming soon...</p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-blue/20 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-halo bg-400% animate-halo-shift opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-xl mb-3 font-medium">Chat Input Preferences</h3>
            <p className="text-white/70 mb-3">Customize your chat input experience</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Custom halo effects</span>
              <span className="text-xs text-purple-400 font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Input animations</span>
              <span className="text-xs text-primary-500 font-medium px-2 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Color themes</span>
              <span className="text-xs text-cyan-400 font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">Coming Soon</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-blue/20 rounded-lg p-6">
          <h3 className="text-xl mb-3 font-medium">Notification Preferences</h3>
          <p className="text-white/70">Coming soon...</p>
        </div>
      </div>
    </div>
  );
} 