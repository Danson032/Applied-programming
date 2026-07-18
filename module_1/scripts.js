import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHj3i5-BFzAdw6x2481B0oIpEv5uAJSVw",
  authDomain: "my-task-manager-3e8b1.firebaseapp.com",
  projectId: "my-task-manager-3e8b1",
  storageBucket: "my-task-manager-3e8b1.firebasestorage.app",
  messagingSenderId: "1081387759404",
  appId: "1:1081387759404:web:4a8186b458186c183d5e89",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

async function addTask() {
  const title = document.getElementById("title").value;
  const course = document.getElementById("course").value;
  const dueDate = document.getElementById("dueDate").value;
  const status = document.getElementById("status").value;

  if (title === "") {
    alert("Please enter a task.");
    return;
  }

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      course,
      dueDate,
      status,
    });

    clearForm();

    loadTasks();
  } catch (error) {
    console.log(error);
  }
}

async function loadTasks() {
  taskList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "tasks"));

  querySnapshot.forEach((document) => {
    const task = document.data();

    const div = document.createElement("div");

    div.className = "task";

    div.innerHTML = `

            <h3>${task.title}</h3>

            <p><strong>Course:</strong> ${task.course}</p>

            <p><strong>Due Date:</strong> ${task.dueDate}</p>

            <p><strong>Status:</strong> ${task.status}</p>

            <button class="complete" data-id="${document.id}">

            Mark Completed

            </button>

            <button class="delete" data-id="${document.id}">

            Delete

            </button>

        `;

    taskList.appendChild(div);
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.onclick = async () => {
      await deleteDoc(doc(db, "tasks", button.dataset.id));

      loadTasks();
    };
  });

  document.querySelectorAll(".complete").forEach((button) => {
    button.onclick = async () => {
      await updateDoc(doc(db, "tasks", button.dataset.id), {
        status: "Completed",
      });

      loadTasks();
    };
  });
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("course").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("status").value = "Pending";
}

loadTasks();
