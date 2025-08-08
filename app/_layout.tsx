import { SQLiteProvider } from 'expo-sqlite';
import InnerApp from '../components/ui/innerApp';
import { setupDatabase } from '../services/initDatabase';

export default function Layout() {
  return (
    <SQLiteProvider
      databaseName="posa.db"
      onInit={setupDatabase}
    >
        <InnerApp />
    </SQLiteProvider>
  );
}
