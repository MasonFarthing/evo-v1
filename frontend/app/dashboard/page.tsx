import EvoLogo from "../components/EvoLogo";

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-start h-full pt-24 p-8 bg-gradient-to-br from-black via-blueGrey to-darkBlue">
      <div className="text-center space-y-6 max-w-xl">
        <EvoLogo width={288} height={144} />

        <p className="mt-4 text-lg opacity-80 max-w-md mx-auto">
          Your advanced AI companion.
        </p>
      </div>
    </div>
  );
} 