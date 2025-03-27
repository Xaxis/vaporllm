import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Serve node_modules so the browser can fetch libraries.
app.use(
    "/node_modules",
    express.static(
        path.join(__dirname, "..", "..", "node_modules")
    )
);

// 2) Serve the public folder (index.html, main.js, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
