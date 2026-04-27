# Retail Insights Dashboard

A data-driven web application that helps small retail businesses gain actionable insights from their transactional data. Upload your sales history or enter records manually, and the app computes customer segments, surfaces top products, and recommends related items.

---

## Stack

- **Frontend** — React + Vite + Tailwind CSS + Recharts
- **Backend** — FastAPI (Python)
- **Database** — SQLite
- **ML Pipeline** — scikit-learn (KMeans clustering, cosine similarity)

---

## Features

- **Data Import** — Upload CSV/Excel files or enter individual transactions manually
- **RFM Analysis** — Computes Recency, Frequency, and Monetary metrics per customer
- **Customer Segmentation** — K-Means clustering groups customers into VIP, Loyal, At Risk, and Inactive segments
- **Product Recommendations** — Item-based collaborative filtering using cosine similarity
- **Dashboard** — Live overview of revenue, top customers, top products, and monthly trends

---

## Project Structure

```
├── backend/
│   ├── main.py               # FastAPI app and all API endpoints
│   ├── requirements.txt
│   ├── Procfile              # Railway deployment
│   └── src/
│       ├── db.py             # SQLite database module
│       ├── preprocessing.py  # Data cleaning and validation
│       ├── rfm.py            # RFM computation
│       ├── clustering.py     # KMeans clustering
│       └── recommender.py    # Cosine similarity recommendations
├── frontend/
│   ├── src/
│   │   ├── api.js            # Backend fetch helpers
│   │   ├── App.jsx           # Router and layout
│   │   ├── components/       # Sidebar, TopBar
│   │   └── pages/            # Dashboard, AddData, Segments, Recommendations
│   ├── tailwind.config.js
│   └── vite.config.js
├── data/
│   └── Online Retail.xlsx    # Sample dataset
└── check_silhouette.py       # Evaluate clustering quality
```

---

## Running Locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend** (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Seeding the Database

The database starts empty. Go to the **Add Data** page and upload `data/Online Retail.xlsx` to populate it. After that, all dashboard data will be live.

---

## Clustering Evaluation

```bash
python check_silhouette.py
```

Prints silhouette scores for k=2 through k=7 to help pick the best cluster count.

---

## Use Cases

- Customer segmentation for targeted marketing
- Identifying high-value and at-risk customers
- Product cross-sell and bundling recommendations
- Sales performance analysis over time
