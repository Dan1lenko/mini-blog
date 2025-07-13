import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Ви повинні увійти, щоб створювати пости.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      alert("Пост створено!");
      router.push("/");
    } catch (error) {
      alert("Помилка при створенні посту: " + error.message);
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl mb-6">Створити новий пост</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Текст посту"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Опублікувати
        </button>
      </form>
    </main>
  );
}
