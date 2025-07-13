import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";


 export  function   HandleReomveMenuItem (menuName:string) 
  {

const db = useSQLiteContext();

    if (!menuName) {
      Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'The name must be exactly the same.' });
      return;
    }
    try {
     db.runAsync(
        `DELETE FROM menu_items WHERE name = ${menuName.trim()}`
      );
      Toast.show({ type: 'success', text1: 'Item Removed', text2: `${menuName} parmanently deleted.`, position:'top'});
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Insert Failed', position:'top'});
    }
  };
