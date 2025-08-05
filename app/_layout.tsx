import { SQLiteProvider } from 'expo-sqlite';
import { setupDatabase } from '../services/initDatabase';
import InnerApp from '../components/ui/innerApp';



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
