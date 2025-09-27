import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Text, View } from "react-native";
import { auth } from "../firebaseConfig";


async function register(email, pass) {
  const user = await createUserWithEmailAndPassword(auth, email, pass);
  console.log(user.user.uid);
}

async function login(email, pass) {
  const user = await signInWithEmailAndPassword(auth, email, pass);
  console.log(user.user.uid);
}


export default function Login() {



  return(
    <View>
        <Text>
            probando porbando
        </Text>
    </View>
  );
}