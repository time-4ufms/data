const app = require('./server');
const db = require('./database'); 
const uploadRoutes = require('./routes/upload');
const uploadRoutesTesouro = require('./routes/uploadTesouro');
app.use(uploadRoutes);
app.use(uploadRoutesTesouro);

app.get('/', (req, res) => {
    res.send("Pantanal DEV");
});

const port = 4000;
app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});