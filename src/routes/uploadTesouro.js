// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('../database');

const upload = multer({ dest: 'uploads/' });

router.post('/uploadTesouro', upload.single('file'), async (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv({ separator: '\t' }))
        .on('data', (data) => {
            const cleanedRow = {};
            for (const key in data) {
                cleanedRow[key.trim()] = data[key].trim();
            }
            console.log("Colunas detectadas:", Object.keys(cleanedRow));
            results.push(cleanedRow);
        })
        .on('end', async () => {
            for (const row of results) {
                const values = [
                    row['Codigo do Investidor'],
                    row['Data de Adesao'],
                    row['Estado Civil'],
                    row['Genero'],
                    row['Profissao'],
                    row['Idade'],
                    row['UF do Investidor'],
                    row['Cidade do Investidor'],
                    row['Pais do Investidor'],
                    row['Situacao da Conta'],
                    row['Operou 12 Meses']
                ];

                const placeholders = values.map(() => '?').join(', ');

                const sql = `
                    INSERT INTO tesouro (
                        codigo_investidor,
                        data_adesao,
                        estado_civil,
                        genero,
                        profissao,
                        idade,
                        uf_investidor,
                        cidade_investidor,
                        pais_investidor,
                        situacao_conta,
                        operou_12_meses
                    ) VALUES (${placeholders})
                `;

                db.query(sql, values, (err) => {
                    if (err) {
                        console.error("Erro ao inserir linha:", err.message);
                    }
                });
            }

            res.send("Importação para a tabela 'tesouro' concluída com sucesso!");
        });
});

module.exports = router;
