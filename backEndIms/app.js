const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use("/auth", authRoutes);

app.get('/test', (req, res) => {
    res.send("Test complete");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});