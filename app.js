const apiStatus = document.getElementById("apiStatus");
const patientsCount = document.getElementById("patientsCount");
const patientsList = document.getElementById("patientsList");
const msg = document.getElementById("msg");

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    apiStatus.textContent = data.ok ? "متصل" : "غير متصل";
  } catch {
    apiStatus.textContent = "خطأ";
  }
}

async function loadPatients() {
  const res = await fetch("/api/patients");
  const data = await res.json();
  patientsCount.textContent = data.length;
  patientsList.innerHTML = "";

  if (!data.length) {
    patientsList.innerHTML = "<p>لا يوجد مرضى بعد.</p>";
    return;
  }

  data.forEach((patient) => {
    const item = document.createElement("div");
    item.className = "patient-item";
    item.innerHTML = `
      <div>
        <strong>${patient.name || "-"}</strong>
        <div class="patient-meta">
          الهاتف: ${patient.phone || "-"} | العمر: ${patient.age || "-"} | ${patient.notes || ""}
        </div>
      </div>
      <button class="danger" onclick="deletePatient('${patient._id}')">حذف</button>
    `;
    patientsList.appendChild(item);
  });
}

async function addPatient() {
  const payload = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    age: Number(document.getElementById("age").value) || undefined,
    notes: document.getElementById("notes").value.trim(),
  };

  if (!payload.name) {
    msg.textContent = "اكتب اسم المريض أولًا";
    return;
  }

  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    msg.textContent = "تمت الإضافة بنجاح";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("age").value = "";
    document.getElementById("notes").value = "";
    loadPatients();
  } else {
    msg.textContent = "فشلت الإضافة";
  }
}

async function deletePatient(id) {
  await fetch(`/api/patients/${id}`, { method: "DELETE" });
  loadPatients();
}

document.getElementById("addBtn").addEventListener("click", addPatient);
checkHealth();
loadPatients();