import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (auth.currentUser?.uid !== data.authorId) {
          alert("У тебе немає прав редагувати цей пост.");
          router.push("/");
          return;
        }
        setTitle(data.title);
        setContent(data.content);
      } else {
        alert("Пост не знайдено");
        router.push("/");
      }
      setLoading(false);
    };

    if (id) fetchPost();
  }, [id, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        title,
        content,
      });
      alert("Пост оновлено!");
      router.push(`/post/${id}`);
    } catch (err) {
      alert("Помилка: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Завантаження...</p>;

  return (
    <main className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl mb-6">Редагувати пост</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
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
          Зберегти зміни
        </button>
      </form>
    </main>
  );
}
