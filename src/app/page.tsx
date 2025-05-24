"use client";

import { useEffect, useState } from "react";
import emailjs from "emailjs-com";

type Task = {
  id: string;
  title: string;
  description?: string;
  deadline: { seconds: number; nanoseconds: number };
  email: string;
  done: boolean;
};

export default function ToDoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    email: "",
  });

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data: Task[] = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    const res = await fetch("/api/tasks/add", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setForm({ title: "", description: "", deadline: "", email: "" });
      fetchTasks();
    }
  };

  const markDone = async (id: string) => {
    await fetch("/api/tasks/done", {
      method: "PATCH",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
  };

  const sendReminder = async (
    email: string,
    title: string,
    deadline: Task["deadline"]
  ) => {
    const formattedDate = new Date(deadline.seconds * 1000);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: email,
          task_title: title,
          task_deadline: formattedDate,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      alert("Email trimis cu succes!");
    } catch (err) {
      console.error("Eroare la trimitere email:", err);
      alert("Eroare la trimitere email.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#ffffff] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">
          📝 To-Do List cu Deadline
        </h1>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-8 mb-12 space-y-6">
          <h2 className="text-2xl font-semibold text-blue-700">
            ➕ Adaugă o sarcină
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Titlu"
              className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Descriere"
            className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="datetime-local"
            className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />

          <button
            onClick={addTask}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-medium shadow-md transition"
          >
            Salvează sarcina
          </button>
        </div>

        <ul className="space-y-6">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-6 rounded-3xl shadow-lg transition hover:scale-[1.01] ${
                task.done
                  ? "bg-green-50 border border-green-200"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {task.title}
                </h3>
                {task.done && (
                  <span className="text-green-600 text-sm font-medium">
                    ✅ Completă
                  </span>
                )}
              </div>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                📅 Deadline:{" "}
                <span className="font-medium">
                  {new Date(task.deadline.seconds * 1000).toLocaleString(
                    "ro-RO"
                  )}
                </span>
              </p>
              <p className="text-sm text-gray-400">📧 Email: {task.email}</p>

              <div className="flex gap-3 mt-5">
                {!task.done && (
                  <button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm shadow-sm"
                    onClick={() => markDone(task.id)}
                  >
                    Finalizează
                  </button>
                )}
                <button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm shadow-sm"
                  onClick={() =>
                    sendReminder(task.email, task.title, task.deadline)
                  }
                >
                  Trimite reminder
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
