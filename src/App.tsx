import { useEffect, useState } from "react";
import { seedDatabase } from "./infrastructure/seed";
import { AppRoutes } from "./presentation/routes/AppRoutes";

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) seedDatabase().then(() => setIsReady(true));
  }, [isReady]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dark">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4" />
          <p className="text-text-muted">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
