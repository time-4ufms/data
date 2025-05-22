const app = require('./server');
const db = require('./database'); // Isso já inicia a conexão
const uploadRoutes = require('./routes/upload');
app.use(uploadRoutes);


app.get('/', (req, res) => {
    res.send("Pantanal DEV");
});

const port = 4000;
app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});