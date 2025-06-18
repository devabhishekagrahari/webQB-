import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";


export const saveQuestionToFirestore = async (questionData) => {
  console.log("Saving question to Firestore:", questionData);
  try {
    const docRef = await addDoc(collection(db, "questions"), questionData);
    console.log("Question added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding question:", error);
    alert("Failed to add question.");
  }
};
