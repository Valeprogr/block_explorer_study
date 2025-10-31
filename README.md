#  Ethereum Block Explorer • Valentina Vittoria © 2025

<img width="1434" height="677" alt="Screenshot 2025-10-31 alle 12 09 55" src="https://github.com/user-attachments/assets/dc98ad7d-0d83-4abd-83bb-c9ee3c55de89" />

A minimal and elegant **Ethereum Block Explorer** built with **React** and **Alchemy SDK**, allowing you to fetch and display the latest Ethereum block data — including block details, gas info, and recent transactions — in real time.


## 🚀 Features

* Fetches the **latest Ethereum block** using the [Alchemy SDK](https://www.alchemy.com/sdk).
* Displays detailed **block metadata** (hash, parent hash, gas, base fee, timestamp, miner, etc.).
* Shows the **latest transactions** included in the block.
* Responsive, clean, and minimalist **Tailwind CSS** UI.
* Error handling, loading states, and live refresh button.

---

## 🧩 Tech Stack

* ⚛️ **React (Vite or CRA)**
* 🧠 **Alchemy SDK** — for Ethereum blockchain data
* 🎨 **Tailwind CSS** — for styling
* 💾 **ES2020** features support (BigInt-safe rendering)

---

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ethereum-block-explorer.git
   cd ethereum-block-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Create an environment file**

   In the project root, create a `.env` file and add your **Alchemy API key**:

   ```env
   REACT_APP_ALCHEMY_API_KEY=""
   ```

   > ⚠️ Make sure to put your **own Alchemy API key** between the quotes.

4. **Start the app**

   ```bash
   npm start
   ```

   or (if using Vite)

   ```bash
   npm run dev
   ```

5. Open your browser at
   👉 [http://localhost:3000](http://localhost:3000) (CRA)
   or
   👉 [http://localhost:5173](http://localhost:5173) (Vite)

---

## 🧠 How It Works

* The app connects to **Alchemy** through the API key you provide in the `.env` file.
* It uses the functions `getBlockNumber()`, `getBlockInfo()`, and `getBlockWithTransactions()` from a custom `services/alchemy.js` module.
* These functions retrieve Ethereum block data and transactions, which are then stored in React state.
* The UI renders:

  * **Latest Block Number**
  * **Detailed Block Info**
  * **Recent Transactions List**
  * A collapsible **Raw JSON** viewer for debugging.

---

## 🧑‍💻 What I Built

This project was developed by **Valentina Vittoria** as a personal learning and showcase project for:

* Integrating the **Alchemy SDK** with React.
* Handling asynchronous blockchain data fetching.
* Working with **BigInt** values safely in JavaScript.
* Designing a modern **block explorer interface** using Tailwind CSS and React hooks.

It’s meant to be a starting point for anyone interested in exploring Ethereum data directly from the browser with a clean, intuitive UI.

---

## 📜 License

© 2025 Valentina Vittoria.
This project is open for educational and non-commercial use.




