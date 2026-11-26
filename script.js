
let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

const form = document.getElementById("schedule-form");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const categoryInput = document.getElementById("category");
// カテゴリーごとの色を設定
const categoryColors = {
    "学校": "#dbeafe",
    "アルバイト": "#ffedd5",
    "プライベート": "#dcfce7"
};
const scheduleList = document.getElementById("schedule-list");

let editingId = null;

// 編集キャンセルボタンを作成
const cancelButton = document.createElement("button");
cancelButton.textContent = "編集をキャンセル";
cancelButton.type = "button";
cancelButton.style.display = "none";
cancelButton.style.backgroundColor = "#888";
form.appendChild(cancelButton);

function saveSchedules() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

function displaySchedules() {
    scheduleList.innerHTML = "";

    schedules.sort((a, b) => {
        return (a.date + a.time).localeCompare(b.date + b.time);
    });

    if (schedules.length === 0) {
        scheduleList.innerHTML = "<p>まだ予定はありません。</p>";
        return;
    }

    schedules.forEach((schedule) => {
        const item = document.createElement("div");
        item.style.padding = "15px";
        item.style.borderBottom = "1px solid #ddd";

        const name = document.createElement("strong");
        name.textContent = schedule.title;

        const categoryLabel = document.createElement("span");
categoryLabel.textContent = schedule.category || "未分類";
categoryLabel.style.marginLeft = "10px";
categoryLabel.style.padding = "3px 8px";
categoryLabel.style.borderRadius = "12px";
categoryLabel.style.backgroundColor =
    categoryColors[schedule.category] || "#e5e7eb";
categoryLabel.style.color = "#333";
categoryLabel.style.fontSize = "12px";

name.appendChild(categoryLabel);
        const detail = document.createElement("p");
        detail.textContent = `${schedule.date} ${schedule.time}`;

        // 編集ボタン
        const editButton = document.createElement("button");
        editButton.textContent = "編集";
        editButton.style.backgroundColor = "#e6a23c";
        editButton.style.padding = "8px 15px";
        editButton.style.marginRight = "8px";

        editButton.addEventListener("click", () => {
            editingId = schedule.id;

            titleInput.value = schedule.title;
            dateInput.value = schedule.date;
            timeInput.value = schedule.time;

            form.querySelector('button[type="submit"]').textContent = "変更を保存";
            cancelButton.style.display = "block";
        });

        // 削除ボタン
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.style.backgroundColor = "#e05252";
        deleteButton.style.padding = "8px 15px";

        deleteButton.addEventListener("click", () => {
            schedules = schedules.filter(
                (s) => s.id !== schedule.id
            );

            if (editingId === schedule.id) {
                cancelEdit();
            }

            saveSchedules();
            displaySchedules();
        });

        item.appendChild(name);
        item.appendChild(detail);
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        scheduleList.appendChild(item);
    });
}

// 編集をキャンセルする
function cancelEdit() {
    editingId = null;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = "予定を追加";
    cancelButton.style.display = "none";
}

cancelButton.addEventListener("click", cancelEdit);

// 予定を追加・編集する
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();

    if (!title) return;

    if (editingId !== null) {
        const target = schedules.find(
            (s) => s.id === editingId
        );

        if (target) {
            target.title = title;
            target.date = dateInput.value;
            target.time = timeInput.value;
            target.category = categoryInput.value;
        }

    } else {
        schedules.push({
            id: Date.now(),
            title: title,
            date: dateInput.value,
            time: timeInput.value,
            category: categoryInput.value
        });
    }

    saveSchedules();
    cancelEdit();
    displaySchedules();
});

displaySchedules();

