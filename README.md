# 🧾 MGNREGA District Performance Dashboard

This project visualizes the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)** performance data for Indian districts in an easy-to-understand way — designed especially for **low-literacy rural users**.

---

## 🌍 Features

✅ **State & District Selection:**  
Select your State and District to view real-time performance data.

✅ **Live KPI Dashboard:**  
Shows:
- 🏠 Households Benefited  
- 📆 Average Days per Household  
- 💰 Total Wages Paid  

✅ **Performance Charts:**  
Displays monthly and yearly trends using simple visuals.

✅ **Offline Fallback (localStorage):**  
If API is down, shows last saved data automatically.

✅ **Mobile-Friendly UI:**  
Clean, colorful, and easy to read — ideal for rural citizens.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Chart.js  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Hosting:** Render (Backend) + Netlify (Frontend)

---

## ⚙️ Architecture Overview
Frontend (HTML/CSS/JS)
↓
Express.js API (Backend)
↓
PostgreSQL Database (Stores performance data)
↓
LocalStorage (Offline backup in browser)

---

## 🚀 How It Works

1. User selects **State** and **District**  
2. App fetches live data from the **Express API**  
3. Data is shown on dashboard + saved in localStorage  
4. If API is down, app shows **offline saved data**  


## 💡 Future Enhancements

- Auto-detect user location and suggest their district  
- Add regional language translations  
- SMS-based data access for non-smartphone users

---

## 👩‍💻 Developer

**Prajakta Sawant**  
✨ Passionate about building solutions that simplify government data for citizens.  
📬 [LinkedIn Profile](https://www.linkedin.com/in/prajakta-sawant-b87394306) | [Email](prajaktasawant2307@gmail.com)

---

⭐ *If you liked this project, don’t forget to star this repo!*

